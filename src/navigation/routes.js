import LEGACY_FRAGMENT_ALIASES from './fragment-aliases.js'

const SECTION_PATHS = {
  overview: '/',
  projects: '/projects/',
  experience: '/experience/',
  skills: '/skills/',
}

const PROJECT_IDS = new Set([
  'foroom',
  'buddy4good',
  'eggbot',
  'teleai',
  'foodhero',
  'portfolio',
])

const SITE_ORIGIN = 'https://www.tranhathu.com'

export function sectionPathFor(sectionId) {
  return SECTION_PATHS[sectionId] || SECTION_PATHS.overview
}

export function projectPathFor(projectId) {
  return PROJECT_IDS.has(projectId) ? `/projects/${projectId}/` : SECTION_PATHS.projects
}

export function routePathForFragment(fragment) {
  const value = String(fragment || '').replace(/^#/, '')
  const canonical = LEGACY_FRAGMENT_ALIASES[value] || value
  if (canonical.startsWith('project-')) return projectPathFor(canonical.slice('project-'.length))
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
  return {
    path: projectPathFor(projectId),
    fragment: `project-${projectId}`,
    sectionId: 'projects',
    projectId,
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
  return routeForSection('overview', { ...options, legacy: true, isKnownPath: false })
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
  if (routePath === '/') return routeForSection('overview', { legacy: normalizedPath !== '/' })

  for (const [sectionId, path] of Object.entries(SECTION_PATHS)) {
    if (routePath === path) return routeForSection(sectionId, { legacy: hasIndexHtml || normalizedPath !== routePath })
  }

  const projectMatch = routePath.match(/^\/projects\/([^/]+)\/$/)
  if (projectMatch && validProjectIds.has(projectMatch[1])) {
    return routeForProject(projectMatch[1], { legacy: hasIndexHtml || normalizedPath !== routePath })
  }

  return routeForSection('overview', { legacy: true, isKnownPath: false })
}

export function getPortfolioPageMetadata(route, project) {
  const title = route.projectId && project
    ? `${project.title} | Tran Ha Thu`
    : route.sectionId === 'projects'
      ? 'Projects | Tran Ha Thu'
      : route.sectionId === 'experience'
        ? 'Experience | Tran Ha Thu'
        : route.sectionId === 'skills'
          ? 'Skills | Tran Ha Thu'
          : 'Tran Ha Thu | Software Engineering & AI Portfolio'
  const description = route.projectId && project
    ? `${project.title}: ${project.summary}`
    : route.sectionId === 'projects'
      ? 'Backend applications, data tools and automation projects by Tran Ha Thu, with source code and technical details.'
      : route.sectionId === 'experience'
        ? 'Software engineering, data analysis and machine learning experience for Tran Ha Thu.'
        : route.sectionId === 'skills'
          ? 'Programming languages, frameworks and tools used by Tran Ha Thu across software and AI projects.'
          : "Explore Tran Ha Thu's portfolio: software engineering, full-stack development and AI projects, technical experience, and contact details."
  const canonicalUrl = `${SITE_ORIGIN}${route.path}`
  return { title, description, canonicalUrl }
}

export const portfolioRoutePaths = [
  ...Object.values(SECTION_PATHS),
  ...[...PROJECT_IDS].map((projectId) => projectPathFor(projectId)),
]
