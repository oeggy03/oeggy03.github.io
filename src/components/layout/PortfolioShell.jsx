import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { Github, Linkedin, Mail } from 'lucide-react'
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

function SocialLinks({ profile }) {
  const links = [
    { icon: Mail, label: `Email ${profile.name}`, href: `mailto:${profile.email}` },
    { icon: Github, label: `${profile.name} on GitHub`, href: profile.github },
    { icon: Linkedin, label: `${profile.name} on LinkedIn`, href: profile.linkedin },
  ]

  return (
    <div className="flex flex-wrap items-center justify-end gap-1" role="group" aria-label="Contact and social links">
      {links.map(({ icon: Icon, label, href }) => (
        <a key={label} className="inline-flex size-11 shrink-0 items-center justify-center rounded-full text-muted transition-colors duration-150 hover:bg-surface hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent motion-reduce:transition-none" href={href} aria-label={label} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}>
          <Icon aria-hidden="true" className="size-5" />
        </a>
      ))}
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
  const [toolbarIsSticky, setToolbarIsSticky] = useState(false)
  const [toolbarStickinessMeasured, setToolbarStickinessMeasured] = useState(false)
  const activeId = fragment.startsWith('project-') ? 'projects' : fragment

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
            <div className="md:hidden"><SocialLinks profile={profile} /></div>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-1 md:mt-0 md:flex-[1_1_60%] md:justify-between md:gap-6">
            <PortfolioNavigation sections={sections} activeId={activeId} onClick={handleNavigationClick} />
            <a href={profile.resume} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 min-w-11 flex-[1_1_18%] items-center justify-center rounded-full px-2 text-xs font-semibold text-accent-ink underline decoration-accent underline-offset-4 hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:text-sm md:hidden">Resume</a>
            <div className="hidden flex-wrap items-center justify-end gap-2 md:flex">
              <SocialLinks profile={profile} />
              <ActionLink href={profile.resume} target="_blank" rel="noopener noreferrer" variant="primary" className="rounded-full px-5">
                Resume
              </ActionLink>
            </div>
          </div>
        </div>
      </header>

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
          <a className="inline-flex min-h-11 items-center text-muted underline decoration-line underline-offset-4 hover:text-ink hover:decoration-accent focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent" href={`mailto:${profile.email}`}>Get in touch</a>
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
