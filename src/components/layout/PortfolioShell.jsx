import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { Github, Linkedin, Mail, X } from 'lucide-react'
import { ActionLink } from '../ui/index.jsx'
import { PortfolioNavigationProvider } from '../../navigation/NavigationProvider.jsx'
import LEGACY_FRAGMENT_ALIASES from '../../navigation/fragment-aliases.js'
import { usePortfolioNavigation } from '../../navigation/NavigationContext.jsx'
import { resolvePortfolioRoute, sectionPathFor } from '../../navigation/routes.js'

const useIsomorphicLayoutEffect = typeof document === 'undefined' ? useEffect : useLayoutEffect

const portfolioSectionPropType = PropTypes.arrayOf(PropTypes.shape({
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  content: PropTypes.node.isRequired,
}))

const portfolioProfilePropType = PropTypes.shape({
  name: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  github: PropTypes.string.isRequired,
  linkedin: PropTypes.string.isRequired,
  resume: PropTypes.string.isRequired,
})

const legacyAnchorIds = {
  experience: Object.entries(LEGACY_FRAGMENT_ALIASES)
    .filter(([anchorId, sectionId]) => sectionId === 'experience' && anchorId !== 'experience')
    .map(([anchorId]) => anchorId),
  projects: Object.entries(LEGACY_FRAGMENT_ALIASES)
    .filter(([, sectionId]) => sectionId === 'projects')
    .map(([anchorId]) => anchorId),
}

function SocialIcon({ icon: Icon, label, tooltip, href, onClick, copyAction = false }) {
  const tooltipId = useId()
  const triggerRef = useRef(null)
  const tooltipRef = useRef(null)
  const [isHovered, setIsHovered] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [tooltipPosition, setTooltipPosition] = useState({ left: 16, top: 16 })
  const showTooltip = (isHovered || isFocused) && !dismissed

  useIsomorphicLayoutEffect(() => {
    if (!showTooltip) return undefined

    const updateTooltipPosition = () => {
      const trigger = triggerRef.current
      const tooltipElement = tooltipRef.current
      if (!trigger || !tooltipElement) return

      const triggerBounds = trigger.getBoundingClientRect()
      const tooltipBounds = tooltipElement.getBoundingClientRect()
      const viewportWidth = document.documentElement.clientWidth || window.innerWidth
      const viewportHeight = window.visualViewport?.height || window.innerHeight
      const gutter = 16
      const left = Math.min(
        Math.max(gutter, triggerBounds.right - tooltipBounds.width),
        Math.max(gutter, viewportWidth - tooltipBounds.width - gutter),
      )
      const top = triggerBounds.bottom + tooltipBounds.height <= viewportHeight - gutter
        ? triggerBounds.bottom
        : Math.max(gutter, triggerBounds.top - tooltipBounds.height)

      setTooltipPosition((current) => current.left === left && current.top === top ? current : { left, top })
    }

    updateTooltipPosition()
    window.addEventListener('resize', updateTooltipPosition)
    window.visualViewport?.addEventListener('resize', updateTooltipPosition)
    return () => {
      window.removeEventListener('resize', updateTooltipPosition)
      window.visualViewport?.removeEventListener('resize', updateTooltipPosition)
    }
  }, [showTooltip])

  useEffect(() => {
    if (!showTooltip) return undefined

    const dismissTooltip = (event) => {
      if (event.key === 'Escape') {
        setDismissed(true)
        setIsHovered(false)
      }
    }
    window.addEventListener('keydown', dismissTooltip)
    return () => window.removeEventListener('keydown', dismissTooltip)
  }, [showTooltip])

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => { setIsHovered(true); setDismissed(false) }}
      onMouseLeave={() => {
        setIsHovered(false)
        if (!isFocused) setDismissed(false)
      }}
      onFocus={() => { setIsFocused(true); setDismissed(false) }}
      onBlur={(event) => {
        if (event.currentTarget.contains(event.relatedTarget)) return
        setIsFocused(false)
        if (!isHovered) setDismissed(false)
      }}
      onKeyDown={(event) => {
        if (event.key !== 'Escape' || !showTooltip) return
        event.preventDefault()
        event.stopPropagation()
        setDismissed(true)
      }}
    >
      {copyAction ? (
        <button ref={triggerRef} type="button" data-copy-email aria-label="Copy work email to clipboard" aria-describedby={tooltipId} onClick={onClick} className="inline-flex size-11 shrink-0 items-center justify-center rounded-full text-muted transition-colors duration-150 hover:bg-surface hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent motion-reduce:transition-none">
          <Icon aria-hidden="true" className="size-5" />
        </button>
      ) : (
        <a ref={triggerRef} className="inline-flex size-11 shrink-0 items-center justify-center rounded-full text-muted transition-colors duration-150 hover:bg-surface hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent motion-reduce:transition-none" href={href} aria-label={label} aria-describedby={tooltipId} target="_blank" rel="noopener noreferrer">
          <Icon aria-hidden="true" className="size-5" />
        </a>
      )}
      <span ref={tooltipRef} id={tooltipId} role="tooltip" data-social-tooltip={tooltip} style={tooltipPosition} className={`fixed z-[70] w-max max-h-[calc(100vh-2rem)] max-h-[calc(100dvh-2rem)] max-w-[calc(100vw-2rem)] overflow-y-auto pt-1 text-xs font-semibold text-paper [overflow-wrap:anywhere] transition-opacity motion-reduce:transition-none ${showTooltip ? 'visible opacity-100' : 'invisible opacity-0'}`}>
        <span className="block rounded-lg bg-ink px-3 py-2 shadow-lg">{tooltip}</span>
      </span>
    </span>
  )
}

SocialIcon.propTypes = {
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string,
  tooltip: PropTypes.string.isRequired,
  href: PropTypes.string,
  onClick: PropTypes.func,
  copyAction: PropTypes.bool,
}

function SocialLinks({ profile, onCopyEmail }) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-1" role="group" aria-label="Contact and social links">
      <SocialIcon icon={Mail} label="Copy work email to clipboard" tooltip="Copy my email" onClick={onCopyEmail} copyAction />
      <SocialIcon icon={Github} label={`${profile.name} on GitHub`} tooltip="View my GitHub" href={profile.github} />
      <SocialIcon icon={Linkedin} label={`${profile.name} on LinkedIn`} tooltip="View my LinkedIn" href={profile.linkedin} />
    </div>
  )
}

SocialLinks.propTypes = {
  profile: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    github: PropTypes.string.isRequired,
    linkedin: PropTypes.string.isRequired,
  }).isRequired,
  onCopyEmail: PropTypes.func.isRequired,
}

function PortfolioNavigation({ sections, activeId, onClick }) {
  return (
    <nav aria-label="Portfolio sections" className="min-w-0 flex-[1_1_72%] md:flex-[1_0_auto]">
      <ul className="flex flex-wrap items-center justify-center gap-1 sm:gap-2 md:justify-start md:gap-5">
        {sections.map(({ id, label }) => {
          const active = activeId === id
          return (
            <li key={id} className="min-w-0 flex-[1_0_auto] md:flex-none">
              <a href={sectionPathFor(id)} className={`inline-flex min-h-11 min-w-11 whitespace-nowrap items-center justify-center rounded-full px-2 text-xs font-medium leading-tight transition-colors duration-150 hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent motion-reduce:transition-none sm:text-sm md:px-3 ${active ? 'font-semibold text-ink underline decoration-accent decoration-2 underline-offset-[9px]' : 'text-muted'}`} aria-current={active ? 'page' : undefined} onClick={(event) => onClick(event, id)}>
                {label}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

PortfolioNavigation.propTypes = {
  sections: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  })).isRequired,
  activeId: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
}

function PortfolioShellLayout({ sections, profile }) {
  const { fragment, navigate, navigateToAnchor } = usePortfolioNavigation()
  const toolbarRef = useRef(null)
  const emailTriggerRef = useRef(null)
  const [toolbarIsSticky, setToolbarIsSticky] = useState(false)
  const [toolbarStickinessMeasured, setToolbarStickinessMeasured] = useState(false)
  const [emailFeedback, setEmailFeedback] = useState(null)
  const activeId = fragment.startsWith('project-') ? 'projects' : fragment

  const copyWorkEmail = async (event) => {
    if (event?.currentTarget instanceof HTMLElement) emailTriggerRef.current = event.currentTarget
    setEmailFeedback(null)
    try {
      await navigator.clipboard.writeText(profile.email)
    } catch {
      let copied = false
      const trigger = document.activeElement
      const selection = window.getSelection()
      const selectedRange = selection?.rangeCount ? selection.getRangeAt(0).cloneRange() : null
      const fallback = document.createElement('textarea')
      fallback.value = profile.email
      fallback.setAttribute('readonly', '')
      fallback.setAttribute('aria-hidden', 'true')
      fallback.style.position = 'fixed'
      fallback.style.opacity = '0'
      document.body.append(fallback)
      fallback.select()
      try {
        copied = document.execCommand('copy')
      } catch {
        copied = false
      }
      fallback.remove()
      if (trigger instanceof HTMLElement) trigger.focus({ preventScroll: true })
      if (selectedRange) {
        selection?.removeAllRanges()
        selection?.addRange(selectedRange)
      }

      if (!copied) {
        setEmailFeedback({ copied: false })
        return
      }
    }
    setEmailFeedback({ copied: true })
  }

  const dismissEmailFeedback = () => {
    setEmailFeedback(null)
    if (emailTriggerRef.current?.isConnected) emailTriggerRef.current.focus({ preventScroll: true })
  }

  useIsomorphicLayoutEffect(() => {
    const toolbar = toolbarRef.current
    if (!toolbar) return undefined

    const measureToolbar = () => {
      const toolbarHeight = toolbar.getBoundingClientRect().height
      const availableHeight = window.visualViewport?.height || window.innerHeight
      setToolbarIsSticky(toolbarHeight > 0 && toolbarHeight <= availableHeight * 0.4)
      setToolbarStickinessMeasured(true)
    }

    measureToolbar()
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measureToolbar)
    observer?.observe(toolbar)
    window.addEventListener('resize', measureToolbar)
    window.visualViewport?.addEventListener('resize', measureToolbar)

    return () => {
      observer?.disconnect()
      window.removeEventListener('resize', measureToolbar)
      window.visualViewport?.removeEventListener('resize', measureToolbar)
    }
  }, [])

  const handleNavigationClick = (event, id) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.currentTarget.target || event.currentTarget.hasAttribute('download')) return
    event.preventDefault()
    navigate(id, { focus: 'preserve' })
  }

  const handleInternalAnchorClick = (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    const anchor = event.target.closest?.('a[href]')
    if (!anchor || (anchor.target && anchor.target !== '_self') || anchor.hasAttribute('download')) return

    const url = new URL(anchor.href, window.location.href)
    if (url.origin !== window.location.origin || url.search !== window.location.search) return
    if (url.hash) {
      if (url.pathname !== window.location.pathname) return
      let anchorId
      try {
        anchorId = decodeURIComponent(url.hash.slice(1))
      } catch {
        return
      }
      if (!document.getElementById(anchorId)) return
      event.preventDefault()
      navigateToAnchor(anchorId)
      return
    }
    const route = resolvePortfolioRoute(url.pathname)
    if (!route.isKnownPath) return
    event.preventDefault()
    navigate(route.fragment, {
      scroll: route.projectId ? 'project' : 'top',
      focus: route.projectId ? 'project' : 'heading',
    })
  }

  return (
    <div className="min-h-screen bg-canvas text-ink" onClick={handleInternalAnchorClick}>
      <header ref={toolbarRef} data-portfolio-toolbar data-portfolio-mobile-navigation data-portfolio-sticky={toolbarIsSticky ? 'true' : 'false'} data-portfolio-sticky-ready={toolbarStickinessMeasured ? 'true' : undefined} className={`${toolbarIsSticky ? 'sticky top-0 z-50' : 'relative'} border-b border-line bg-canvas`}>
          <div className="mx-auto w-full max-w-[1120px] px-4 py-2 sm:px-7 md:flex md:min-h-[76px] md:flex-wrap md:items-center md:justify-between md:gap-6 md:py-3">
          <a href="#portfolio-content" className="sr-only z-50 font-semibold text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:w-max focus:max-w-[calc(100vw-2rem)] focus:min-h-11 focus:rounded-full focus:bg-paper focus:px-4 focus:py-3 focus:text-base focus:whitespace-normal focus:break-normal focus:outline focus:outline-2 focus:outline-accent">Skip to content</a>
          <div className="flex min-h-11 min-w-0 flex-wrap items-center justify-between gap-x-2 gap-y-1 md:shrink-0 md:flex-nowrap md:justify-start md:gap-8">
            <div className="min-w-0">
              <h1 className="break-words text-lg font-semibold tracking-tight text-ink sm:text-xl">{profile.name}</h1>
              <p className="text-sm leading-5 text-muted">{profile.role}</p>
            </div>
            <div className="md:hidden"><SocialLinks profile={profile} onCopyEmail={copyWorkEmail} /></div>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-1 md:mt-0 md:flex-[1_1_60%] md:justify-between md:gap-6">
            <PortfolioNavigation sections={sections} activeId={activeId} onClick={handleNavigationClick} />
            <a href={profile.resume} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 min-w-11 flex-[1_1_18%] items-center justify-center rounded-full border border-action bg-action px-3 py-2 text-xs font-semibold text-action-foreground transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent motion-reduce:transition-none sm:text-sm md:hidden">Resume</a>
            <div className="hidden flex-wrap items-center justify-end gap-2 md:flex">
              <SocialLinks profile={profile} onCopyEmail={copyWorkEmail} />
              <ActionLink href={profile.resume} target="_blank" rel="noopener noreferrer" variant="primary" className="rounded-full px-5">
                Resume
              </ActionLink>
            </div>
          </div>
        </div>
      </header>

      <div className="sr-only" data-copy-email-announcement role={emailFeedback?.copied === false ? 'alert' : 'status'} aria-live={emailFeedback?.copied === false ? 'assertive' : 'polite'} aria-atomic="true">
        {emailFeedback?.copied === true ? `My work email ${profile.email} has been copied to your clipboard!` : emailFeedback?.copied === false ? `Copy failed. You can copy my work email: ${profile.email}` : ''}
      </div>
      {emailFeedback && <div data-copy-email-toast role="group" aria-label="Email copy feedback" aria-live="off" className="fixed bottom-4 left-1/2 z-[70] max-h-[calc(100vh-2rem)] max-h-[calc(100dvh-2rem)] w-[min(32rem,calc(100vw-2rem))] -translate-x-1/2 overflow-y-auto overscroll-contain rounded-2xl border border-line bg-paper p-3 text-sm leading-6 text-ink shadow-xl sm:p-4">
        <div className="flow-root min-w-0">
          <button type="button" onClick={dismissEmailFeedback} aria-label="Dismiss email copy message" className="sticky top-0 z-10 float-right ml-3 inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-paper text-muted shadow-sm hover:bg-surface hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
            <X aria-hidden="true" className="size-4" />
          </button>
          <p className="min-w-0 [overflow-wrap:anywhere]" data-copy-email-message>
            {emailFeedback.copied
              ? `My work email ${profile.email} has been copied to your clipboard!`
              : <>Copy failed. You can copy my work email: <span className="select-all font-semibold">{profile.email}</span></>}
          </p>
        </div>
      </div>}

      <div id="portfolio-content" tabIndex={-1} className="mx-auto min-h-[calc(100vh-180px)] w-full max-w-[1120px] scroll-mt-36 px-5 pb-20 pt-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent sm:px-7 sm:pb-24 sm:pt-6">
        {sections.map(({ id, content }) => (
          <section
            key={id}
            id={id}
            className="min-w-0 scroll-mt-32"
            hidden={activeId !== id}
          >
            {legacyAnchorIds[id]?.map((anchorId) => (
              <span key={anchorId} id={anchorId} aria-hidden="true" className="sr-only" />
            ))}
            {content}
          </section>
        ))}
      </div>

      <footer className="border-t border-line">
        <div className="mx-auto flex w-full max-w-[1120px] flex-wrap items-center justify-between gap-3 px-5 py-5 text-sm text-muted sm:px-7">
          <p>© Tran Ha Thu</p>
          <button type="button" onClick={copyWorkEmail} aria-label="Copy work email to clipboard" className="inline-flex min-h-11 items-center text-muted underline decoration-line underline-offset-4 hover:text-ink hover:decoration-accent focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">Copy work email</button>
        </div>
      </footer>
    </div>
  )
}

PortfolioShellLayout.propTypes = {
  sections: portfolioSectionPropType.isRequired,
  profile: portfolioProfilePropType.isRequired,
}

function PortfolioShell({ sections, profile, initialRoute }) {
  return (
    <PortfolioNavigationProvider initialRoute={initialRoute}>
      <PortfolioShellLayout sections={sections} profile={profile} />
    </PortfolioNavigationProvider>
  )
}

PortfolioShell.propTypes = {
  sections: portfolioSectionPropType.isRequired,
  profile: portfolioProfilePropType.isRequired,
  initialRoute: PropTypes.shape({
    fragment: PropTypes.string.isRequired,
    sectionId: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
  }).isRequired,
}

export default PortfolioShell
