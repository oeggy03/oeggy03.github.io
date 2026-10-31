import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { projects } from '../data/portfolio.js'
import PortfolioNavigationContext from './navigation-context.js'
import { getPortfolioPageMetadata, resolvePortfolioRoute } from './routes.js'

const SCROLL_STATE_KEY = '__portfolioScrollY'
const ENTRY_STATE_KEY = '__portfolioEntryId'
const ENTRY_URL_KEY = '__portfolioEntryUrl'
const useIsomorphicLayoutEffect = typeof document === 'undefined' ? useEffect : useLayoutEffect

function currentUrl() {
  return `${window.location.pathname}${window.location.search}${window.location.hash}`
}

function routeUrl(route) {
  return `${route.path}${window.location.search}`
}

function focusWithoutScroll(element) {
  if (!element) return
  if (!element.matches('a[href], button, input, select, textarea, [tabindex]')) {
    element.setAttribute('tabindex', '-1')
  }
  element.focus({ preventScroll: true })
}

function isMobileViewport() {
  return window.matchMedia('(max-width: 1023px)').matches
}

function stickyToolbarHeight() {
  const toolbar = document.querySelector('[data-portfolio-toolbar]')
  if (!toolbar || getComputedStyle(toolbar).position !== 'sticky') return 0
  return toolbar.getBoundingClientRect().height
}

export function PortfolioNavigationProvider({ initialRoute, children }) {
  const projectIds = useMemo(() => new Set(projects.map(({ id }) => id)), [])
  const [fragment, setFragment] = useState(initialRoute.fragment)
  const fragmentRef = useRef(initialRoute.fragment)
  const pendingTransitionRef = useRef(null)
  const scrollFrameRef = useRef(0)
  const sameFragmentFrameRef = useRef(0)
  const deferredFrameRef = useRef(0)
  const entrySequenceRef = useRef(0)
  const entryScrollCacheRef = useRef(new Map())
  const activeEntryIdRef = useRef(null)
  const activeAnchorTargetRef = useRef(null)
  const routeFadeRef = useRef(null)
  const pendingRouteScrollCommitRef = useRef(null)

  useIsomorphicLayoutEffect(() => {
    const route = resolvePortfolioRoute(fragment, projectIds)
    const project = projects.find(({ id }) => id === route.projectId)
    const { title, description, canonicalUrl } = getPortfolioPageMetadata(route, project)
    document.title = title

    const setMeta = (selector, attribute, value) => {
      const element = document.querySelector(selector)
      if (element) element.setAttribute(attribute, value)
    }

    setMeta('meta[name="description"]', 'content', description)
    setMeta('meta[property="og:title"]', 'content', title)
    setMeta('meta[property="og:description"]', 'content', description)
    setMeta('meta[property="og:url"]', 'content', canonicalUrl)
    setMeta('meta[name="twitter:title"]', 'content', title)
    setMeta('meta[name="twitter:description"]', 'content', description)
    const canonical = document.querySelector('link[rel="canonical"]')
    if (canonical) canonical.setAttribute('href', canonicalUrl)

    const schemaElement = document.querySelector('script[type="application/ld+json"]')
    if (schemaElement) {
      try {
        const schema = JSON.parse(schemaElement.textContent)
        schema['@id'] = `${canonicalUrl}#profile`
        schema.url = canonicalUrl
        schema.name = title
        schemaElement.textContent = JSON.stringify(schema)
      } catch {
        // Static pages always have valid JSON-LD; keep route navigation working if it was edited incorrectly.
      }
    }
  }, [fragment, projectIds])

  const saveSettledOffset = useCallback(() => {
    const state = window.history.state && typeof window.history.state === 'object'
      ? window.history.state
      : {}
    const entryId = state[ENTRY_STATE_KEY]
    const url = currentUrl()
    if (!entryId || state[ENTRY_URL_KEY] !== url) return
    const offset = window.scrollY
    window.history.replaceState({
      ...state,
      [SCROLL_STATE_KEY]: offset,
    }, '', url)
    entryScrollCacheRef.current.set(entryId, offset)
    activeEntryIdRef.current = entryId
  }, [])

  const cancelPendingRouteScrollCommit = useCallback(() => {
    const frame = pendingRouteScrollCommitRef.current
    if (frame === null) return
    cancelAnimationFrame(frame)
    pendingRouteScrollCommitRef.current = null
  }, [])

  const scheduleRouteScrollCommit = useCallback((scrollY, url) => {
    cancelPendingRouteScrollCommit()
    const frame = requestAnimationFrame(() => {
      if (pendingRouteScrollCommitRef.current !== frame) return
      pendingRouteScrollCommitRef.current = null
      if (currentUrl() !== url) return
      window.scrollTo({ top: scrollY, behavior: 'auto' })
      saveSettledOffset()
    })
    pendingRouteScrollCommitRef.current = frame
  }, [cancelPendingRouteScrollCommit, saveSettledOffset])

  const cancelRouteFade = useCallback(() => {
    const animation = routeFadeRef.current
    if (!animation) return
    routeFadeRef.current = null
    animation.cancel()
  }, [])

  const fadePortfolioContent = useCallback(() => {
    cancelRouteFade()
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const content = document.getElementById('portfolio-content')
    if (!content || typeof content.animate !== 'function') return
    const animation = content.animate(
      [{ opacity: 0.3 }, { opacity: 1 }],
      { duration: 190, easing: 'ease-out' },
    )
    routeFadeRef.current = animation
    animation.finished.then(
      () => { if (routeFadeRef.current === animation) routeFadeRef.current = null },
      () => { if (routeFadeRef.current === animation) routeFadeRef.current = null },
    )
  }, [cancelRouteFade])

  const flushTransition = useCallback(() => {
    const pending = pendingTransitionRef.current
    if (!pending) return
    pendingTransitionRef.current = null
    const { route, options, previousSectionId, previousProjectId, previousProjectIsCaseStudy, mode, animateRoute, commitScroll } = pending
    if (mode === 'restore') {
      const storedY = Number(options.scrollY)
      window.scrollTo({ top: Number.isFinite(storedY) && storedY >= 0 ? storedY : 0, behavior: 'auto' })
      saveSettledOffset()
      return
    }

    const mobile = isMobileViewport()
    let destination = null
    if (options.scroll === 'top') {
      window.scrollTo({ top: 0, behavior: 'auto' })
    } else if (options.scroll === 'project' && route.projectId) {
      const projectTarget = document.getElementById(`project-${route.projectId}`)
      const projectHeading = document.getElementById(`project-heading-${route.projectId}`)
      const cameFromAnotherSection = previousSectionId !== 'projects'

      if (mobile) {
        if (projectTarget) {
          const stickyHeight = stickyToolbarHeight()
          const targetY = window.scrollY + projectTarget.getBoundingClientRect().top - stickyHeight - 16
          window.scrollTo({ top: Math.max(0, targetY), behavior: 'auto' })
          destination = projectHeading || projectTarget
        } else if (projectHeading) {
          const stickyHeight = stickyToolbarHeight()
          const targetY = window.scrollY + projectHeading.getBoundingClientRect().top - stickyHeight - 16
          window.scrollTo({ top: Math.max(0, targetY), behavior: 'auto' })
          destination = projectHeading
        }
      } else if (cameFromAnotherSection) {
        window.scrollTo({ top: 0, behavior: 'auto' })
        destination = projectHeading || document.querySelector('#projects h2')
      } else {
        const explorer = document.querySelector('[data-project-explorer]')
        const explorerTop = explorer?.getBoundingClientRect().top
        const toolbarBottom = stickyToolbarHeight()
        const explorerVisible = Number.isFinite(explorerTop)
          && explorerTop >= toolbarBottom + 12
          && explorerTop < window.innerHeight * 0.8
        if (!explorerVisible && explorer) {
          window.scrollTo({ top: Math.max(0, window.scrollY + explorerTop - toolbarBottom - 12), behavior: 'auto' })
          destination = projectHeading
        } else if (!explorer && projectHeading) {
          const targetY = window.scrollY + projectHeading.getBoundingClientRect().top - toolbarBottom - 16
          window.scrollTo({ top: Math.max(0, targetY), behavior: 'auto' })
          destination = projectHeading
        }
        if ((!previousProjectId || previousProjectIsCaseStudy || !document.querySelector('[data-project-explorer]')) && projectHeading) destination = projectHeading
      }
    }

    if (options.focus === 'heading') {
      if (route.projectId && options.scroll === 'project' && mobile) {
        destination ||= document.getElementById(`project-heading-${route.projectId}`)
      } else {
      destination ||= (route.projectId
        ? document.getElementById(`project-heading-${route.projectId}`)
        : document.querySelector(`#${route.sectionId} h2`)) || document.getElementById(route.sectionId)
      }
      focusWithoutScroll(destination)
    } else if (options.focus === 'project' && route.projectId) {
      const targetIsCaseStudy = !document.querySelector('[data-project-explorer]')
      const shouldFocusProjectHeading = previousSectionId !== 'projects'
        || !previousProjectId
        || previousProjectIsCaseStudy
        || targetIsCaseStudy
      if (mobile) {
        destination ||= document.getElementById(`project-heading-${route.projectId}`)
        focusWithoutScroll(destination)
      } else if (!mobile && shouldFocusProjectHeading) {
        destination ||= document.getElementById(`project-heading-${route.projectId}`) || document.querySelector('#projects h2')
        focusWithoutScroll(destination)
      }
    }
    if (commitScroll) scheduleRouteScrollCommit(window.scrollY, currentUrl())
    if (animateRoute) fadePortfolioContent()
    saveSettledOffset()
  }, [fadePortfolioContent, saveSettledOffset, scheduleRouteScrollCommit])

  const queueTransition = useCallback((transition) => {
    if (sameFragmentFrameRef.current) {
      cancelAnimationFrame(sameFragmentFrameRef.current)
      sameFragmentFrameRef.current = 0
    }
    if (deferredFrameRef.current) {
      cancelAnimationFrame(deferredFrameRef.current)
      deferredFrameRef.current = 0
    }
    pendingTransitionRef.current = transition
    if (transition.deferUntilPaint) {
      deferredFrameRef.current = requestAnimationFrame(() => {
        deferredFrameRef.current = requestAnimationFrame(() => {
          deferredFrameRef.current = 0
          if (pendingTransitionRef.current !== transition) return
          transition.deferUntilPaint = false
          flushTransition()
        })
      })
    } else if (transition.sameFragment) {
      sameFragmentFrameRef.current = requestAnimationFrame(() => {
        sameFragmentFrameRef.current = 0
        flushTransition()
      })
    }
  }, [flushTransition])

  const createEntryId = useCallback(() => {
    entrySequenceRef.current += 1
    return `portfolio-${Date.now()}-${entrySequenceRef.current}`
  }, [])

  const writeCurrentEntryOffset = useCallback((offset, url = currentUrl(), forceNewEntry = false) => {
    const existingState = window.history.state && typeof window.history.state === 'object'
      ? window.history.state
      : {}
    const hasMatchingEntry = !forceNewEntry
      && existingState[ENTRY_STATE_KEY]
      && existingState[ENTRY_URL_KEY] === url
    const entryId = hasMatchingEntry ? existingState[ENTRY_STATE_KEY] : createEntryId()
    const nextState = {
      ...existingState,
      [ENTRY_STATE_KEY]: entryId,
      [ENTRY_URL_KEY]: url,
      [SCROLL_STATE_KEY]: offset,
    }
    window.history.replaceState(nextState, '', url)
    entryScrollCacheRef.current.set(entryId, offset)
    activeEntryIdRef.current = entryId
    return entryId
  }, [createEntryId])

  const saveCurrentOffset = useCallback(() => {
    if (scrollFrameRef.current) {
      cancelAnimationFrame(scrollFrameRef.current)
      scrollFrameRef.current = 0
    }
    writeCurrentEntryOffset(window.scrollY, currentUrl())
  }, [writeCurrentEntryOffset])

  const stopAnchorScroll = useCallback((finishTarget = false, saveOffset = true) => {
    const anchorId = activeAnchorTargetRef.current
    if (!anchorId) return
    activeAnchorTargetRef.current = null
    if (finishTarget) {
      document.getElementById(anchorId)?.scrollIntoView({ block: 'start', behavior: 'auto' })
    } else {
      window.scrollTo({ top: window.scrollY, behavior: 'auto' })
    }
    if (saveOffset) saveSettledOffset()
  }, [saveSettledOffset])

  const navigateToAnchor = useCallback((anchorId) => {
    const target = document.getElementById(anchorId)
    if (!target) return
    cancelPendingRouteScrollCommit()
    cancelRouteFade()
    const route = resolvePortfolioRoute(fragmentRef.current, projectIds)
    const nextUrl = `${route.path}${window.location.search}#${anchorId}`
    if (currentUrl() !== nextUrl) {
      saveCurrentOffset()
      const entryId = createEntryId()
      window.history.pushState({
        [ENTRY_STATE_KEY]: entryId,
        [ENTRY_URL_KEY]: nextUrl,
        [SCROLL_STATE_KEY]: 0,
      }, '', nextUrl)
      entryScrollCacheRef.current.set(entryId, 0)
      activeEntryIdRef.current = entryId
    }
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const shouldSmoothScroll = !reducedMotion
      && ['work-history', 'education', 'what-im-building'].includes(anchorId)
    if (shouldSmoothScroll) {
      activeAnchorTargetRef.current = anchorId
    } else {
      stopAnchorScroll(false)
    }
    target.scrollIntoView({ block: 'start', behavior: shouldSmoothScroll ? 'smooth' : 'auto' })
    focusWithoutScroll(target)
    writeCurrentEntryOffset(window.scrollY, nextUrl)
  }, [cancelPendingRouteScrollCommit, cancelRouteFade, createEntryId, projectIds, saveCurrentOffset, stopAnchorScroll, writeCurrentEntryOffset])

  const navigate = useCallback((target, options = {}) => {
    const route = resolvePortfolioRoute(target, projectIds)
    const nextOptions = {
      replace: options.replace === true,
      scroll: options.scroll || (route.projectId ? 'project' : 'top'),
      focus: options.focus || 'heading',
    }
    const previousRoute = resolvePortfolioRoute(fragmentRef.current, projectIds)
    const previousSectionId = previousRoute.sectionId
    const previousProjectId = previousRoute.projectId
    const previousProjectIsCaseStudy = previousRoute.projectView === 'info'
      && Boolean(projects.find(({ id }) => id === previousProjectId)?.caseStudy)
    const sameFragment = route.fragment === fragmentRef.current
    const nextUrl = routeUrl(route)
    const animateRoute = !sameFragment && currentUrl() !== nextUrl

    cancelPendingRouteScrollCommit()
    stopAnchorScroll(false)
    cancelRouteFade()

    if (nextOptions.replace) {
      writeCurrentEntryOffset(window.scrollY, nextUrl)
    } else if (currentUrl() !== nextUrl) {
      saveCurrentOffset()
      const entryId = createEntryId()
      window.history.pushState({
        [ENTRY_STATE_KEY]: entryId,
        [ENTRY_URL_KEY]: nextUrl,
        [SCROLL_STATE_KEY]: 0,
      }, '', nextUrl)
      entryScrollCacheRef.current.set(entryId, 0)
      activeEntryIdRef.current = entryId
    }

    fragmentRef.current = route.fragment
    queueTransition({ route, options: nextOptions, previousSectionId, previousProjectId, previousProjectIsCaseStudy, mode: 'navigate', sameFragment, animateRoute, commitScroll: nextOptions.scroll !== 'preserve' })
    setFragment(route.fragment)
  }, [cancelPendingRouteScrollCommit, cancelRouteFade, createEntryId, projectIds, queueTransition, saveCurrentOffset, stopAnchorScroll, writeCurrentEntryOffset])

  useIsomorphicLayoutEffect(() => {
    if (pendingTransitionRef.current
      && !pendingTransitionRef.current.deferUntilPaint
      && pendingTransitionRef.current.route.fragment === fragment) {
      flushTransition()
    }
  }, [flushTransition, fragment])

  useIsomorphicLayoutEffect(() => {
    const previousRestoration = window.history.scrollRestoration
    window.history.scrollRestoration = 'manual'
    writeCurrentEntryOffset(window.scrollY, currentUrl())

    const replaceCanonicalUrl = (route, offset = window.scrollY, forceNewEntry = false) => {
      const preserveUnknownHash = window.location.hash && !route.legacyHash
      const url = `${routeUrl(route)}${preserveUnknownHash ? window.location.hash : ''}`
      if (window.location.pathname !== route.path || (route.legacyHash && window.location.hash)) {
        writeCurrentEntryOffset(offset, url, forceNewEntry)
        return true
      }
      return false
    }

    const isManagedHistoryEntry = () => {
      const state = window.history.state && typeof window.history.state === 'object'
        ? window.history.state
        : null
      const entryId = state?.[ENTRY_STATE_KEY]
      return typeof entryId === 'string'
        && state[ENTRY_URL_KEY] === currentUrl()
        && (entryScrollCacheRef.current.has(entryId) || Number.isFinite(state[SCROLL_STATE_KEY]))
    }

    const updateFromLocation = (mode, deferUntilPaint = false) => {
      const route = resolvePortfolioRoute(window.location, projectIds)
      const currentState = window.history.state && typeof window.history.state === 'object'
        ? window.history.state
        : {}
      const currentEntryId = currentState[ENTRY_STATE_KEY]
      const restoreOffset = currentEntryId && entryScrollCacheRef.current.has(currentEntryId)
        ? entryScrollCacheRef.current.get(currentEntryId)
        : currentState[SCROLL_STATE_KEY]
      const wasCanonicalized = replaceCanonicalUrl(
        route,
        mode === 'restore' && Number.isFinite(restoreOffset) ? restoreOffset : 0,
        mode === 'navigate',
      )
      const previousRoute = resolvePortfolioRoute(fragmentRef.current, projectIds)
      const previousSectionId = previousRoute.sectionId
      const previousProjectId = previousRoute.projectId
      const previousProjectIsCaseStudy = previousRoute.projectView === 'info'
        && Boolean(projects.find(({ id }) => id === previousProjectId)?.caseStudy)
      const sameFragment = route.fragment === fragmentRef.current
      fragmentRef.current = route.fragment
      if (mode === 'restore') {
        const state = window.history.state && typeof window.history.state === 'object'
          ? window.history.state
          : {}
        const entryId = state[ENTRY_STATE_KEY]
        const storedY = entryId && entryScrollCacheRef.current.has(entryId)
          ? entryScrollCacheRef.current.get(entryId)
          : state[SCROLL_STATE_KEY]
        activeEntryIdRef.current = state[ENTRY_STATE_KEY] || activeEntryIdRef.current
        queueTransition({
          route,
          options: { scrollY: storedY },
          previousSectionId,
          previousProjectId,
          previousProjectIsCaseStudy,
          mode: 'restore',
          sameFragment,
          deferUntilPaint,
        })
      } else {
        if (!wasCanonicalized) writeCurrentEntryOffset(window.scrollY, currentUrl(), true)
        queueTransition({
          route,
          options: {
            scroll: window.location.hash && !route.legacyHash
              ? 'preserve'
              : route.projectId ? 'project' : 'top',
            focus: 'heading',
          },
          previousSectionId,
          previousProjectId,
          previousProjectIsCaseStudy,
          mode: 'navigate',
          sameFragment,
          deferUntilPaint,
        })
      }
      setFragment(route.fragment)
    }

    const initialRoute = resolvePortfolioRoute(window.location, projectIds)
    replaceCanonicalUrl(initialRoute)
    const initialPreviousRoute = resolvePortfolioRoute(fragmentRef.current, projectIds)
    const initialPreviousSection = initialPreviousRoute.sectionId
    fragmentRef.current = initialRoute.fragment
    queueTransition({
      route: initialRoute,
      options: {
        scroll: initialRoute.legacyHash && initialRoute.projectId ? 'project' : 'preserve',
        focus: 'preserve',
      },
      previousSectionId: initialPreviousSection,
      previousProjectId: initialPreviousRoute.projectId,
      previousProjectIsCaseStudy: initialPreviousRoute.projectView === 'info'
        && Boolean(projects.find(({ id }) => id === initialPreviousRoute.projectId)?.caseStudy),
      mode: 'navigate',
      sameFragment: initialRoute.fragment === 'experience',
    })
    setFragment(initialRoute.fragment)

    const handleScroll = () => {
      if (pendingTransitionRef.current) return
      if (scrollFrameRef.current) return
      scrollFrameRef.current = requestAnimationFrame(() => {
        scrollFrameRef.current = 0
        const state = window.history.state && typeof window.history.state === 'object'
          ? window.history.state
          : {}
        const entryId = state[ENTRY_STATE_KEY]
        if (entryId) {
          entryScrollCacheRef.current.set(entryId, window.scrollY)
          activeEntryIdRef.current = entryId
        }
      })
    }
    const handleScrollEnd = () => {
      const anchorId = activeAnchorTargetRef.current
      if (!anchorId) return
      const target = document.getElementById(anchorId)
      if (!target) {
        activeAnchorTargetRef.current = null
        return
      }
      const targetDocumentY = target.getBoundingClientRect().top + window.scrollY
      const marginTop = Number.parseFloat(getComputedStyle(target).scrollMarginTop) || 0
      const scrollRoot = document.scrollingElement || document.documentElement
      const maxScrollY = Math.max(0, scrollRoot.scrollHeight - document.documentElement.clientHeight)
      const expectedY = Math.min(Math.max(0, targetDocumentY - marginTop), maxScrollY)
      if (Math.abs(window.scrollY - expectedY) > 2) return
      activeAnchorTargetRef.current = null
      saveSettledOffset()
    }
    const handleUserScrollIntent = () => {
      const hadPendingRouteCommit = pendingRouteScrollCommitRef.current !== null
      cancelPendingRouteScrollCommit()
      if (activeAnchorTargetRef.current) stopAnchorScroll(false)
      else if (hadPendingRouteCommit) window.scrollTo({ top: window.scrollY, behavior: 'auto' })
    }
    const handlePopState = () => {
      const route = resolvePortfolioRoute(window.location, projectIds)
      const isManagedEntry = isManagedHistoryEntry()
      if (window.location.hash && !route.legacyHash && route.fragment === fragmentRef.current && !isManagedEntry) return
      cancelPendingRouteScrollCommit()
      stopAnchorScroll(false, false)
      cancelRouteFade()
      if (isManagedEntry && activeEntryIdRef.current) {
        entryScrollCacheRef.current.set(activeEntryIdRef.current, window.scrollY)
      }
      if (scrollFrameRef.current) {
        cancelAnimationFrame(scrollFrameRef.current)
        scrollFrameRef.current = 0
      }
      updateFromLocation(isManagedEntry ? 'restore' : 'navigate', true)
    }
    const handleHashChange = () => {
      const route = resolvePortfolioRoute(window.location, projectIds)
      if (!route.legacyHash) return
      cancelPendingRouteScrollCommit()
      stopAnchorScroll(false, false)
      cancelRouteFade()
      updateFromLocation('navigate', true)
    }
    const handlePageHide = () => writeCurrentEntryOffset(window.scrollY, currentUrl())

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('scrollend', handleScrollEnd)
    document.addEventListener('scrollend', handleScrollEnd)
    window.addEventListener('wheel', handleUserScrollIntent, { passive: true, capture: true })
    window.addEventListener('touchstart', handleUserScrollIntent, { passive: true, capture: true })
    window.addEventListener('pointerdown', handleUserScrollIntent, { capture: true })
    const handleKeyScrollIntent = (event) => {
      if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' ', 'Tab', 'Escape'].includes(event.key)) handleUserScrollIntent()
    }
    window.addEventListener('keydown', handleKeyScrollIntent, true)
    window.addEventListener('popstate', handlePopState)
    window.addEventListener('hashchange', handleHashChange)
    window.addEventListener('pagehide', handlePageHide)

    return () => {
      window.history.scrollRestoration = previousRestoration
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('scrollend', handleScrollEnd)
      document.removeEventListener('scrollend', handleScrollEnd)
      window.removeEventListener('wheel', handleUserScrollIntent, true)
      window.removeEventListener('touchstart', handleUserScrollIntent, true)
      window.removeEventListener('pointerdown', handleUserScrollIntent, true)
      window.removeEventListener('keydown', handleKeyScrollIntent, true)
      window.removeEventListener('popstate', handlePopState)
      window.removeEventListener('hashchange', handleHashChange)
      window.removeEventListener('pagehide', handlePageHide)
      cancelPendingRouteScrollCommit()
      if (scrollFrameRef.current) cancelAnimationFrame(scrollFrameRef.current)
      if (sameFragmentFrameRef.current) cancelAnimationFrame(sameFragmentFrameRef.current)
      if (deferredFrameRef.current) cancelAnimationFrame(deferredFrameRef.current)
    }
  }, [cancelPendingRouteScrollCommit, cancelRouteFade, projectIds, queueTransition, saveSettledOffset, stopAnchorScroll, writeCurrentEntryOffset])

  useEffect(() => {
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const supportsChangeEvent = typeof motionPreference.addEventListener === 'function'
    const handleMotionPreferenceChange = () => {
      if (!motionPreference.matches) return
      stopAnchorScroll(true)
      cancelRouteFade()
    }
    if (supportsChangeEvent) motionPreference.addEventListener('change', handleMotionPreferenceChange)
    else motionPreference.addListener?.(handleMotionPreferenceChange)

    return () => {
      if (supportsChangeEvent) motionPreference.removeEventListener('change', handleMotionPreferenceChange)
      else motionPreference.removeListener?.(handleMotionPreferenceChange)
      stopAnchorScroll(false)
      cancelRouteFade()
    }
  }, [cancelRouteFade, stopAnchorScroll])

  const value = useMemo(() => ({ fragment, navigate, navigateToAnchor }), [fragment, navigate, navigateToAnchor])
  return <PortfolioNavigationContext.Provider value={value}>{children}</PortfolioNavigationContext.Provider>
}

PortfolioNavigationProvider.propTypes = {
  initialRoute: PropTypes.shape({
    fragment: PropTypes.string.isRequired,
    sectionId: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
    projectId: PropTypes.string,
    legacyHash: PropTypes.bool,
  }).isRequired,
  children: PropTypes.node.isRequired,
}
