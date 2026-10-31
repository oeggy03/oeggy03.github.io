import LEGACY_FRAGMENT_ALIASES from './fragment-aliases.js'

const SECTION_PATHS = {
  experience: '/',
  projects: '/projects/',
  skills: '/skills/',
}

const LEGACY_SECTION_PATHS = {
  '/experience/': 'experience',
}

const PROJECT_IDS = new Set([
  'foroom',
  'buddy4good',
  'eggbot',
  'teleai',
  'foodhero',
  'portfolio',
  'openclaw',
  'chinese-learning',
  'traders-edge',
])

const PROJECT_SLUGS = {
  openclaw: 'openclaw_agent',
  'chinese-learning': 'call_analyzer_chinese_learning',
  'traders-edge': 'traders_edge',
}

const LEGACY_PROJECT_INFO_PATHS = {
  '/projects/openclaw/': 'openclaw',
  '/projects/chinese-learning/': 'chinese-learning',
}

const LEGACY_PROJECT_OVERVIEW_PATHS = {
  '/projects/openclaw_agent/': 'openclaw',
  '/projects/call_analyzer_chinese_learning/': 'chinese-learning',
  '/projects/traders_edge/': 'traders-edge',
}

const SITE_ORIGIN = 'https://www.tranhathu.com'

export function sectionPathFor(sectionId) {
  return SECTION_PATHS[sectionId] || SECTION_PATHS.experience
}

export function projectPathFor(projectId) {
  if (!PROJECT_IDS.has(projectId)) return SECTION_PATHS.projects
  return `/${PROJECT_SLUGS[projectId] || `projects/${projectId}`}/`
}

export function projectInfoPathFor(projectId) {
  return PROJECT_IDS.has(projectId) ? `${projectPathFor(projectId)}info/` : SECTION_PATHS.projects
}

function projectPathToId(routePath) {
  for (const [projectId, slug] of Object.entries(PROJECT_SLUGS)) {
    if (routePath === `/${slug}/` || routePath === `/${slug}/info/`) return projectId
  }

  const projectMatch = routePath.match(/^\/projects\/([^/]+)\/$/)
  return projectMatch && PROJECT_IDS.has(projectMatch[1]) ? projectMatch[1] : null
}

export function routePathForFragment(fragment) {
  const value = String(fragment || '').replace(/^#/, '')
  const canonical = LEGACY_FRAGMENT_ALIASES[value] || value
  if (canonical.startsWith('project-')) {
    const infoProjectId = canonical.match(/^project-(.+)-info$/)?.[1]
    return infoProjectId ? projectInfoPathFor(infoProjectId) : projectPathFor(canonical.slice('project-'.length))
  }
  return sectionPathFor(canonical)
}

function routeForSection(sectionId, options = {}) {
  return {
    path: sectionPathFor(sectionId),
    fragment: sectionId,
    sectionId,
    projectId: null,
    legacy: options.legacy === true,
    legacyHash: options.legacyHash === true,
    isKnownPath: options.isKnownPath !== false,
  }
}

function routeForProject(projectId, options = {}) {
  const projectView = options.projectView || 'overview'
  return {
    path: projectView === 'info' ? projectInfoPathFor(projectId) : projectPathFor(projectId),
    fragment: projectView === 'info' ? `project-${projectId}-info` : `project-${projectId}`,
    sectionId: 'projects',
    projectId,
    projectView,
    legacy: options.legacy === true,
    legacyHash: options.legacyHash === true,
    isKnownPath: options.isKnownPath !== false,
  }
}

function routeForFragment(fragment, options = {}) {
  const raw = String(fragment || '').replace(/^#/, '')
  const canonical = LEGACY_FRAGMENT_ALIASES[raw] || raw
  if (Object.hasOwn(SECTION_PATHS, canonical)) {
    return routeForSection(canonical, { ...options, legacy: options.legacy || canonical !== raw })
  }
  if (canonical.startsWith('project-') && PROJECT_IDS.has(canonical.slice('project-'.length))) {
    return routeForProject(canonical.slice('project-'.length), { ...options, legacy: options.legacy || canonical !== raw })
  }
  const infoProjectId = canonical.match(/^project-(.+)-info$/)?.[1]
  if (infoProjectId && PROJECT_IDS.has(infoProjectId)) {
    return routeForProject(infoProjectId, { ...options, projectView: 'info', legacy: options.legacy || canonical !== raw })
  }
  return routeForSection('experience', { ...options, legacy: true, isKnownPath: false })
}

function getLocationParts(locationLike) {
  if (typeof locationLike === 'string') {
    if (locationLike.startsWith('/')) {
      const [pathnameAndSearch, hashPart = ''] = locationLike.split('#', 2)
      const queryIndex = pathnameAndSearch.indexOf('?')
      return {
        pathname: queryIndex < 0 ? pathnameAndSearch : pathnameAndSearch.slice(0, queryIndex),
        hash: hashPart,
      }
    }
    return { pathname: '/', hash: locationLike.replace(/^#/, '') }
  }
  return {
    pathname: locationLike?.pathname || '/',
    hash: String(locationLike?.hash || '').replace(/^#/, ''),
  }
}

export function resolvePortfolioRoute(locationLike, validProjectIds = PROJECT_IDS) {
  const { pathname, hash } = getLocationParts(locationLike)
  if (hash) {
    const route = routeForFragment(hash)
    if (route.isKnownPath) return { ...route, legacy: true, legacyHash: true }
  }

  const normalizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`
  const hasIndexHtml = normalizedPath.endsWith('/index.html')
  const pathForRoute = hasIndexHtml ? normalizedPath.slice(0, -'index.html'.length) : normalizedPath
  const routePath = pathForRoute === '/' ? '/' : `${pathForRoute.replace(/\/+$/, '')}/`
  if (routePath === '/') return routeForSection('experience', { legacy: normalizedPath !== '/' })

  if (LEGACY_SECTION_PATHS[routePath]) {
    return routeForSection(LEGACY_SECTION_PATHS[routePath], { legacy: true })
  }

  for (const [sectionId, path] of Object.entries(SECTION_PATHS)) {
    if (routePath === path) return routeForSection(sectionId, { legacy: hasIndexHtml || normalizedPath !== routePath })
  }

  const projectInfoMatch = routePath.match(/^\/([^/]+)\/info\/$/)
  if (projectInfoMatch) {
    const projectId = projectPathToId(`/${projectInfoMatch[1]}/`)
    if (projectId && validProjectIds.has(projectId)) return routeForProject(projectId, { projectView: 'info', legacy: hasIndexHtml || normalizedPath !== routePath })
  }

  const projectId = LEGACY_PROJECT_OVERVIEW_PATHS[routePath] || projectPathToId(routePath)
  if (projectId && validProjectIds.has(projectId)) {
    return routeForProject(projectId, {
      projectView: LEGACY_PROJECT_INFO_PATHS[routePath] ? 'info' : 'overview',
      legacy: hasIndexHtml || normalizedPath !== routePath || Boolean(LEGACY_PROJECT_INFO_PATHS[routePath]) || Boolean(LEGACY_PROJECT_OVERVIEW_PATHS[routePath]),
    })
  }

  return routeForSection('experience', { legacy: true, isKnownPath: false })
}

export function getPortfolioPageMetadata(route, project) {
  const title = route.projectId && project
    ? `${project.title}${route.projectView === 'info' ? ' — Full project' : ''} | Tran Ha Thu`
    : route.sectionId === 'projects'
      ? 'Projects | Tran Ha Thu'
      : route.sectionId === 'skills'
        ? 'Skills | Tran Ha Thu'
        : 'Tran Ha Thu | Software Engineering & AI Portfolio'
  const description = route.projectId && project
    ? `${project.title}: ${route.projectView === 'info' ? project.caseStudy?.lead || project.description || project.summary : project.summary}`.slice(0, 200)
    : route.sectionId === 'projects'
      ? 'Backend applications, data tools and automation projects by Tran Ha Thu, with source code and technical details.'
      : route.sectionId === 'skills'
        ? 'Programming languages, frameworks and tools used by Tran Ha Thu across software and AI projects.'
        : "Explore Tran Ha Thu's portfolio: software engineering, full-stack development and AI projects, technical experience, and contact details."
  const canonicalUrl = `${SITE_ORIGIN}${route.path}`
  return { title, description, canonicalUrl }
}

export const portfolioCompatibilityRoutePaths = [
  ...Object.keys(LEGACY_SECTION_PATHS),
  ...Object.keys(LEGACY_PROJECT_INFO_PATHS),
  ...Object.keys(LEGACY_PROJECT_OVERVIEW_PATHS),
]

export const portfolioRoutePaths = [
  ...Object.values(SECTION_PATHS),
  ...[...PROJECT_IDS].map((projectId) => projectPathFor(projectId)),
  ...['openclaw', 'chinese-learning', 'traders-edge'].map((projectId) => projectInfoPathFor(projectId)),
]
