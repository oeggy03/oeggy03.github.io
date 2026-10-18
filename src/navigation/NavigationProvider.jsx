import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { projects } from '../data/portfolio.js'
import PortfolioNavigationContext from './navigation-context.js'

const SCROLL_STATE_KEY = '__portfolioScrollY'
const ENTRY_STATE_KEY = '__portfolioEntryId'
const ENTRY_URL_KEY = '__portfolioEntryUrl'
const useIsomorphicLayoutEffect = typeof document === 'undefined' ? useEffect : useLayoutEffect

const legacyFragments = {
  homepage: 'overview',
  aboutSection: 'about',
  experiencesSec: 'experience',
  projectsSec: 'projects',
  contactSec: 'contact',
}

function resolveFragment(rawFragment, sectionIds, projectIds) {
  const raw = String(rawFragment || '').replace(/^#/, '')
  const canonical = legacyFragments[raw] || raw
  if (sectionIds.has(canonical)) {
    return { fragment: canonical, sectionId: canonical, projectId: null, legacy: canonical !== raw }
  }
  if (canonical.startsWith('project-') && projectIds.has(canonical.slice('project-'.length))) {
    return { fragment: canonical, sectionId: 'projects', projectId: canonical.slice('project-'.length), legacy: false }
  }
  return {
    fragment: 'overview',
    sectionId: 'overview',
    projectId: null,
    legacy: Boolean(raw),
  }
}

function fragmentUrl(fragment) {
  return `${window.location.pathname}${window.location.search}${fragment ? `#${fragment}` : ''}`
}

function currentUrl() {
  return `${window.location.pathname}${window.location.search}${window.location.hash}`
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

export function PortfolioNavigationProvider({ sections, children }) {
  const sectionIds = useMemo(() => new Set(sections.map(({ id }) => id)), [sections])
  const projectIds = useMemo(() => new Set(projects.map(({ id }) => id)), [])
  const [fragment, setFragment] = useState('overview')
  const fragmentRef = useRef('overview')
  const pendingTransitionRef = useRef(null)
  const scrollFrameRef = useRef(0)
  const sameFragmentFrameRef = useRef(0)
  const deferredFrameRef = useRef(0)
  const hashSuppressionTimerRef = useRef(0)
  const entrySequenceRef = useRef(0)
  const entryScrollCacheRef = useRef(new Map())
  const activeEntryIdRef = useRef(null)

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

  const flushTransition = useCallback(() => {
    const pending = pendingTransitionRef.current
    if (!pending) return
    pendingTransitionRef.current = null
    const { route, options, previousSectionId, mode } = pending
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
          const stickyNavigation = document.querySelector('[data-portfolio-mobile-navigation]')
          const stickyHeight = stickyNavigation?.getBoundingClientRect().height || 0
          const offset = stickyHeight + 16
          const targetY = window.scrollY + projectTarget.getBoundingClientRect().top - offset
          window.scrollTo({ top: Math.max(0, targetY), behavior: 'auto' })
          destination = projectHeading || projectTarget
        } else if (projectHeading) {
          const stickyNavigation = document.querySelector('[data-portfolio-mobile-navigation]')
          const stickyHeight = stickyNavigation?.getBoundingClientRect().height || 0
          const targetY = window.scrollY + projectHeading.getBoundingClientRect().top - stickyHeight - 16
          window.scrollTo({ top: Math.max(0, targetY), behavior: 'auto' })
          destination = projectHeading
        }
      } else if (cameFromAnotherSection) {
        window.scrollTo({ top: 0, behavior: 'auto' })
        destination = document.querySelector('#projects h2')
      } else {
        const explorer = document.querySelector('[data-project-explorer]')
        const explorerTop = explorer?.getBoundingClientRect().top
        const toolbarBottom = document.querySelector('[data-portfolio-toolbar]')?.getBoundingClientRect().bottom || 0
        const explorerVisible = Number.isFinite(explorerTop)
          && explorerTop >= toolbarBottom + 12
          && explorerTop < window.innerHeight * 0.8
        if (!explorerVisible && explorer) {
          window.scrollTo({ top: Math.max(0, window.scrollY + explorerTop - toolbarBottom - 12), behavior: 'auto' })
        }
      }
    }

    if (options.focus === 'heading') {
      if (route.projectId && options.scroll === 'project' && mobile) {
        destination ||= document.getElementById(`project-heading-${route.projectId}`)
      } else {
        destination ||= document.querySelector(`#${route.sectionId} h2`) || document.getElementById(route.sectionId)
      }
      focusWithoutScroll(destination)
    } else if (options.focus === 'project' && route.projectId) {
      if (mobile) {
        destination ||= document.getElementById(`project-heading-${route.projectId}`)
        focusWithoutScroll(destination)
      } else if (previousSectionId !== 'projects') {
        destination ||= document.querySelector('#projects h2')
        focusWithoutScroll(destination)
      }
    }
    saveSettledOffset()
  }, [saveSettledOffset])

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

  const navigate = useCallback((target, options = {}) => {
    const rawTarget = String(target || '').replace(/^#/, '')
    const route = resolveFragment(rawTarget, sectionIds, projectIds)
    const nextOptions = {
      replace: options.replace === true,
      scroll: options.scroll || (route.projectId ? 'project' : 'top'),
      focus: options.focus || 'heading',
    }
    const previousSectionId = resolveFragment(fragmentRef.current, sectionIds, projectIds).sectionId
    const sameFragment = route.fragment === fragmentRef.current
    const currentHash = window.location.hash.slice(1)
    const nextUrl = fragmentUrl(route.fragment)

    if (nextOptions.replace) {
      writeCurrentEntryOffset(window.scrollY, nextUrl)
    } else if (!sameFragment || currentHash !== route.fragment) {
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
    queueTransition({ route, options: nextOptions, previousSectionId, mode: 'navigate', sameFragment })
    setFragment(route.fragment)
  }, [createEntryId, projectIds, queueTransition, saveCurrentOffset, sectionIds, writeCurrentEntryOffset])

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

    const replaceCanonicalUrl = (route, { forceNewEntry = false, offset = window.scrollY } = {}) => {
      const currentHash = window.location.hash.slice(1)
      if (currentHash !== route.fragment && (currentHash || route.fragment !== 'overview')) {
        writeCurrentEntryOffset(offset, fragmentUrl(route.fragment), forceNewEntry)
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

    const updateFromLocation = (mode, rawFragment, deferUntilPaint = false) => {
      const route = resolveFragment(rawFragment, sectionIds, projectIds)
      const currentState = window.history.state && typeof window.history.state === 'object'
        ? window.history.state
        : {}
      const currentEntryId = currentState[ENTRY_STATE_KEY]
      const restoreOffset = currentEntryId && entryScrollCacheRef.current.has(currentEntryId)
        ? entryScrollCacheRef.current.get(currentEntryId)
        : currentState[SCROLL_STATE_KEY]
      const wasCanonicalized = replaceCanonicalUrl(route, {
        forceNewEntry: mode === 'navigate',
        offset: mode === 'restore' && Number.isFinite(restoreOffset) ? restoreOffset : 0,
      })
      const previousSectionId = resolveFragment(fragmentRef.current, sectionIds, projectIds).sectionId
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
          mode: 'restore',
          sameFragment,
          deferUntilPaint,
        })
      } else {
        if (!wasCanonicalized) writeCurrentEntryOffset(window.scrollY, currentUrl(), true)
        queueTransition({
          route,
          options: {
            scroll: route.projectId ? 'project' : 'top',
            focus: 'heading',
          },
          previousSectionId,
          mode: 'navigate',
          sameFragment,
          deferUntilPaint,
        })
      }
      setFragment(route.fragment)
    }

    const initialRoute = resolveFragment(window.location.hash.slice(1), sectionIds, projectIds)
    replaceCanonicalUrl(initialRoute)
    const initialPreviousSection = resolveFragment(fragmentRef.current, sectionIds, projectIds).sectionId
    fragmentRef.current = initialRoute.fragment
    queueTransition({
      route: initialRoute,
      options: { scroll: initialRoute.projectId ? 'project' : 'top', focus: 'preserve' },
      previousSectionId: initialPreviousSection,
      mode: 'navigate',
      sameFragment: initialRoute.fragment === 'overview',
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
    const handlePopState = () => {
      const isManagedEntry = isManagedHistoryEntry()
      const rawFragment = window.location.hash.slice(1)
      if (isManagedEntry && activeEntryIdRef.current) {
        entryScrollCacheRef.current.set(activeEntryIdRef.current, window.scrollY)
      }
      if (scrollFrameRef.current) {
        cancelAnimationFrame(scrollFrameRef.current)
        scrollFrameRef.current = 0
      }
      window.clearTimeout(hashSuppressionTimerRef.current)
      hashSuppressionTimerRef.current = window.setTimeout(() => {
        hashSuppressionTimerRef.current = 0
      }, 0)
      updateFromLocation(isManagedEntry ? 'restore' : 'navigate', rawFragment, true)
    }
    const handleHashChange = () => {
      if (hashSuppressionTimerRef.current) return
      const rawFragment = window.location.hash.slice(1)
      updateFromLocation('navigate', rawFragment, true)
    }
    const handlePageHide = () => writeCurrentEntryOffset(window.scrollY, currentUrl())

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('popstate', handlePopState)
    window.addEventListener('hashchange', handleHashChange)
    window.addEventListener('pagehide', handlePageHide)

    return () => {
      window.history.scrollRestoration = previousRestoration
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('popstate', handlePopState)
      window.removeEventListener('hashchange', handleHashChange)
      window.removeEventListener('pagehide', handlePageHide)
      window.clearTimeout(hashSuppressionTimerRef.current)
      if (scrollFrameRef.current) cancelAnimationFrame(scrollFrameRef.current)
      if (sameFragmentFrameRef.current) cancelAnimationFrame(sameFragmentFrameRef.current)
      if (deferredFrameRef.current) cancelAnimationFrame(deferredFrameRef.current)
    }
  }, [projectIds, queueTransition, sectionIds, writeCurrentEntryOffset])

  const value = useMemo(() => ({ fragment, navigate }), [fragment, navigate])
  return <PortfolioNavigationContext.Provider value={value}>{children}</PortfolioNavigationContext.Provider>
}

PortfolioNavigationProvider.propTypes = {
  sections: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.string.isRequired })).isRequired,
  children: PropTypes.node.isRequired,
}

