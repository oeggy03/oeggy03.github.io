import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import {
  BriefcaseBusiness,
  Code2,
  Github,
  House,
  Linkedin,
  Mail,
  PanelsTopLeft,
} from 'lucide-react'
import { ActionLink } from '../ui/index.jsx'
import { PortfolioNavigationProvider } from '../../navigation/NavigationProvider.jsx'
import LEGACY_FRAGMENT_ALIASES from '../../navigation/fragment-aliases.js'
import { usePortfolioNavigation } from '../../navigation/NavigationContext.jsx'
import { resolvePortfolioRoute, sectionPathFor } from '../../navigation/routes.js'

const sectionIcons = {
  overview: House,
  projects: PanelsTopLeft,
  experience: BriefcaseBusiness,
  skills: Code2,
}

const legacyAnchorIds = {
  overview: Object.entries(LEGACY_FRAGMENT_ALIASES)
    .filter(([, sectionId]) => sectionId === 'overview')
    .map(([anchorId]) => anchorId),
  experience: Object.entries(LEGACY_FRAGMENT_ALIASES)
    .filter(([, sectionId]) => sectionId === 'experience')
    .map(([anchorId]) => anchorId),
  projects: Object.entries(LEGACY_FRAGMENT_ALIASES)
    .filter(([, sectionId]) => sectionId === 'projects')
    .map(([anchorId]) => anchorId),
}

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

function SocialLinks({ profile, mobile = false }) {
  const linkClassName = mobile
    ? 'inline-flex min-h-11 min-w-0 items-center justify-center gap-1 rounded-xl border border-line bg-paper/65 px-1 text-[10px] font-medium text-ink transition-colors hover:border-ink/25 hover:bg-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:gap-1.5 sm:px-2 sm:text-xs'
    : 'inline-flex min-h-11 items-center gap-2 rounded-lg px-2 text-sm text-paper/75 transition-colors hover:bg-white/10 hover:text-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper'

  return (
    <div className={mobile ? 'grid w-full grid-cols-3 gap-2' : 'flex flex-wrap items-center gap-1'} role="group" aria-label="Contact and social links">
      <a className={linkClassName} href={`mailto:${profile.email}`} aria-label={`Email ${profile.name}`}>
        <Mail aria-hidden="true" className="size-4" />
        <span>Email</span>
      </a>
      <a className={linkClassName} href={profile.github} target="_blank" rel="noopener noreferrer" aria-label={`${profile.name} on GitHub`}>
        <Github aria-hidden="true" className="size-4" />
        <span>GitHub</span>
      </a>
      <a className={linkClassName} href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${profile.name} on LinkedIn`}>
        <Linkedin aria-hidden="true" className="size-4" />
        <span>LinkedIn</span>
      </a>
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
  mobile: PropTypes.bool,
}

function PortfolioNavigation({ sections, activeId, enhanced, onTabClick, onTabKeyDown, instanceId, mobile = false }) {
  const navItems = sections.map(({ id, label }) => {
    const Icon = sectionIcons[id] || PanelsTopLeft
    const active = activeId === id
    const tabId = `${instanceId}-tab-${id}`
    const tabProps = enhanced
      ? {
          role: 'tab',
          id: tabId,
          'aria-controls': id,
          'aria-selected': active,
          tabIndex: active ? 0 : -1,
        }
      : {}

    const itemClassName = mobile
      ? `flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl border px-1 py-2 text-center transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent motion-reduce:transition-none ${active ? 'border-accent/40 bg-paper text-ink shadow-sm' : 'border-line bg-paper/65 text-muted hover:border-ink/25 hover:text-ink'}`
      : `group flex min-h-11 items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper motion-reduce:transition-none ${active ? 'bg-white/10 text-paper' : 'text-paper/60 hover:bg-white/5 hover:text-paper'}`

    return (
      <a
        key={id}
        href={sectionPathFor(id)}
        className={itemClassName}
        aria-current={active ? 'page' : undefined}
        {...tabProps}
        onClick={(event) => onTabClick(event, id)}
      >
        <Icon aria-hidden="true" className={`size-[17px] shrink-0 ${active && !mobile ? 'text-sage' : ''}`} />
        <span className={mobile ? 'text-[10px] font-semibold leading-none sm:text-[11px]' : 'flex-1'}>{label}</span>
      </a>
    )
  })

  return (
    <nav aria-label="Portfolio sections">
      <div
        className={mobile ? 'grid grid-cols-4 gap-1 sm:gap-2' : 'flex flex-col gap-1'}
        role={enhanced ? 'tablist' : undefined}
        aria-orientation={enhanced && !mobile ? 'vertical' : undefined}
        aria-label={enhanced ? 'Portfolio sections' : undefined}
        onKeyDown={(event) => onTabKeyDown(event, instanceId)}
      >
        {navItems}
      </div>
    </nav>
  )
}

PortfolioNavigation.propTypes = {
  sections: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  })).isRequired,
  activeId: PropTypes.string.isRequired,
  enhanced: PropTypes.bool.isRequired,
  onTabClick: PropTypes.func.isRequired,
  onTabKeyDown: PropTypes.func.isRequired,
  instanceId: PropTypes.string.isRequired,
  mobile: PropTypes.bool,
}

function PortfolioShellLayout({ sections, profile }) {
  const { fragment, navigate } = usePortfolioNavigation()
  const activeId = fragment.startsWith('project-') ? 'projects' : fragment
  const [enhanced, setEnhanced] = useState(false)
  const [desktopNavigation, setDesktopNavigation] = useState(true)

  useEffect(() => {
    const desktopQuery = window.matchMedia('(min-width: 1024px)')
    const updateNavigationMode = () => setDesktopNavigation(desktopQuery.matches)

    updateNavigationMode()
    desktopQuery.addEventListener('change', updateNavigationMode)
    window.addEventListener('resize', updateNavigationMode)
    return () => {
      desktopQuery.removeEventListener('change', updateNavigationMode)
      window.removeEventListener('resize', updateNavigationMode)
    }
  }, [])

  useEffect(() => setEnhanced(true), [])

  const handleTabClick = (event, id) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.currentTarget.target || event.currentTarget.hasAttribute('download')) return
    event.preventDefault()
    navigate(id, { focus: 'preserve' })
    event.currentTarget.focus({ preventScroll: true })
  }

  const handleTabKeyDown = (event, instanceId) => {
    if (!enhanced) return

    const keys = ['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft', 'Home', 'End']
    if (!keys.includes(event.key)) return

    const currentIndex = sections.findIndex(({ id }) => id === activeId)
    let nextIndex = currentIndex
    if (event.key === 'Home') nextIndex = 0
    else if (event.key === 'End') nextIndex = sections.length - 1
    else if (event.key === 'ArrowDown' || event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % sections.length
    else nextIndex = (currentIndex - 1 + sections.length) % sections.length

    event.preventDefault()
    const nextId = sections[nextIndex].id
    navigate(nextId, { focus: 'preserve' })
    const tab = document.getElementById(`${instanceId}-tab-${nextId}`)
    tab?.focus({ preventScroll: true })

    if (instanceId === 'desktop' && tab) {
      const rail = document.querySelector('[data-portfolio-sidebar]')
      const railRect = rail?.getBoundingClientRect()
      const tabRect = tab.getBoundingClientRect()
      if (rail && railRect && tabRect.bottom > railRect.bottom) {
        rail.scrollTop += tabRect.bottom - railRect.bottom
      } else if (rail && railRect && tabRect.top < railRect.top) {
        rail.scrollTop -= railRect.top - tabRect.top
      }
    }
  }

  const handleInternalAnchorClick = (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    const anchor = event.target.closest?.('a[href]')
    if (!anchor || (anchor.target && anchor.target !== '_self') || anchor.hasAttribute('download')) return

    const url = new URL(anchor.href, window.location.href)
    if (url.origin !== window.location.origin || url.search !== window.location.search || url.hash) return
    const route = resolvePortfolioRoute(url.pathname)
    if (!route.isKnownPath) return
    event.preventDefault()
    navigate(route.fragment, {
      scroll: route.projectId ? 'project' : 'top',
      focus: route.projectId ? 'project' : 'heading',
    })
  }

  const activeLabel = sections.find(({ id }) => id === activeId)?.label || 'Overview'

  return (
    <div className="grid min-h-screen bg-ink text-ink lg:grid-cols-[260px_minmax(0,1fr)]" onClick={handleInternalAnchorClick}>
      <aside data-portfolio-sidebar className="flex flex-col items-stretch gap-3 border-b border-white/10 bg-ink px-4 py-3 text-paper sm:px-6 lg:sticky lg:top-0 lg:row-span-1 lg:self-start lg:h-dvh lg:max-h-dvh lg:overflow-y-auto lg:justify-between lg:gap-6 lg:border-b-0 lg:border-r lg:px-5 lg:py-4">
        <div className="flex min-w-0 items-center gap-3 lg:block">
          <div aria-hidden="true" className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/5 font-mono text-sm font-medium tracking-[-0.06em] text-sage lg:size-10">TH</div>
          <div className="min-w-0 lg:mt-3">
            <p className="mb-1 hidden font-mono text-[9px] font-medium uppercase tracking-[0.12em] text-sage lg:block">{profile.role}</p>
            <h1 className="text-base font-semibold tracking-[-0.04em] text-paper sm:text-xl lg:text-[27px] lg:leading-tight">{profile.name}</h1>
            <p className="mt-0.5 text-[11px] leading-4 text-paper/60 sm:text-xs lg:hidden">{profile.role}</p>
          </div>
        </div>

        <div className="hidden lg:block">
          <div className="mb-2 font-mono text-[9px] font-medium uppercase tracking-[0.16em] text-paper/70">Sections</div>
          <PortfolioNavigation
            sections={sections}
            activeId={activeId}
            enhanced={enhanced}
            onTabClick={handleTabClick}
            onTabKeyDown={handleTabKeyDown}
            instanceId="desktop"
          />
        </div>

        <div className="hidden border-t border-white/10 pt-3 lg:block">
          <SocialLinks profile={profile} />
        </div>
      </aside>

      <div className="flex min-h-screen min-w-0 flex-col bg-canvas lg:col-start-2">
        <div data-portfolio-mobile-navigation className="sticky top-0 z-20 border-b border-line bg-canvas px-4 py-3 sm:px-6 lg:hidden">
          <PortfolioNavigation
            sections={sections}
            activeId={activeId}
            enhanced={enhanced}
            onTabClick={handleTabClick}
            onTabKeyDown={handleTabKeyDown}
            instanceId="mobile"
            mobile
          />
          <div className="mt-2 border-t border-line pt-2">
            <SocialLinks profile={profile} mobile />
          </div>
        </div>

        <header data-portfolio-toolbar className="flex min-h-[68px] items-center justify-between gap-4 border-b border-line bg-canvas px-5 py-3 sm:px-8 lg:sticky lg:top-0 lg:z-30 lg:px-8 2xl:px-10">
          <p className="min-w-0 truncate font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-muted sm:text-[11px]">
            <span className="text-ink">Portfolio</span>
            <span className="mx-2 text-line" aria-hidden="true">/</span>
            <span aria-live="polite">{activeLabel}</span>
          </p>
          <ActionLink href={profile.resume} target="_blank" rel="noopener noreferrer" className="shrink-0 px-3 py-2 text-xs sm:px-4 sm:text-sm">
            Resume
          </ActionLink>
        </header>

        <div className="mx-auto w-full max-w-[1500px] flex-1 px-5 py-8 sm:px-8 sm:py-8 lg:px-8 lg:py-8 2xl:px-10">
          {sections.map(({ id, content }) => (
            <section
              key={id}
              id={id}
              className="min-w-0 scroll-mt-40 lg:scroll-mt-6"
              role={enhanced ? 'tabpanel' : undefined}
              aria-labelledby={enhanced ? `${desktopNavigation ? 'desktop' : 'mobile'}-tab-${id}` : undefined}
              tabIndex={enhanced ? 0 : undefined}
              hidden={activeId !== id}
            >
              {legacyAnchorIds[id]?.map((anchorId) => (
                <span key={anchorId} id={anchorId} aria-hidden="true" className="sr-only" />
              ))}
              {content}
            </section>
          ))}
        </div>

        <footer className="border-t border-line px-5 py-5 text-center sm:px-8 lg:px-8 2xl:px-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">&copy; Tran Ha Thu</p>
        </footer>
      </div>
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
