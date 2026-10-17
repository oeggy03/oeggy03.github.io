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
  UserRound,
} from 'lucide-react'
import { ActionLink } from '../ui/index.jsx'
import { projects } from '../../data/portfolio.js'

const projectIds = new Set(projects.map(({ id }) => id))

const sectionIcons = {
  overview: House,
  projects: PanelsTopLeft,
  experience: BriefcaseBusiness,
  skills: Code2,
  about: UserRound,
  contact: Mail,
}

const legacyFragments = {
  homepage: 'overview',
  aboutSection: 'about',
  experiencesSec: 'experience',
  projectsSec: 'projects',
  contactSec: 'contact',
}

const legacyAnchorIds = {
  overview: 'homepage',
  about: 'aboutSection',
  experience: 'experiencesSec',
  projects: 'projectsSec',
  contact: 'contactSec',
}

function resolveFragment(fragment, sections) {
  const sectionIds = new Set(sections.map(({ id }) => id))
  if (sectionIds.has(fragment)) {
    return { sectionId: fragment, targetId: fragment, replaceFragment: null }
  }
  if (legacyFragments[fragment]) {
    const sectionId = legacyFragments[fragment]
    return { sectionId, targetId: sectionId, replaceFragment: sectionId }
  }
  if (fragment.startsWith('project-') && projectIds.has(fragment.slice('project-'.length))) {
    return { sectionId: 'projects', targetId: fragment, replaceFragment: null }
  }
  return { sectionId: 'overview', targetId: 'overview', replaceFragment: fragment ? 'overview' : null }
}

function SocialLinks({ profile, mobile = false }) {
  const linkClassName = mobile
    ? 'inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-white/20 text-paper transition-colors hover:border-white/50 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper'
    : 'inline-flex min-h-11 items-center gap-2 rounded-lg px-2 text-sm text-paper/75 transition-colors hover:bg-white/10 hover:text-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper'

  return (
    <div className={mobile ? 'flex items-center gap-1' : 'flex flex-wrap items-center gap-1'} role="group" aria-label="Contact and social links">
      <a className={linkClassName} href={`mailto:${profile.email}`} aria-label={`Email ${profile.name}`}>
        <Mail aria-hidden="true" className="size-4" />
        {!mobile ? <span>Email</span> : null}
      </a>
      <a className={`${linkClassName} ${mobile ? 'hidden sm:inline-flex' : ''}`} href={profile.github} target="_blank" rel="noopener noreferrer" aria-label={`${profile.name} on GitHub`}>
        <Github aria-hidden="true" className="size-4" />
        {!mobile ? <span>GitHub</span> : null}
      </a>
      <a className={`${linkClassName} ${mobile ? 'hidden sm:inline-flex' : ''}`} href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${profile.name} on LinkedIn`}>
        <Linkedin aria-hidden="true" className="size-4" />
        {!mobile ? <span>LinkedIn</span> : null}
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
        href={`#${id}`}
        className={itemClassName}
        {...tabProps}
        onClick={() => onTabClick(id)}
      >
        <Icon aria-hidden="true" className={`size-[17px] shrink-0 ${active && !mobile ? 'text-sage' : ''}`} />
        <span className={mobile ? 'text-[10px] font-semibold leading-none sm:text-[11px]' : 'flex-1'}>{label}</span>
        {!mobile ? <span aria-hidden="true" className={`ml-auto size-1.5 rounded-full ${active ? 'bg-accent' : 'bg-transparent'}`} /> : null}
      </a>
    )
  })

  return (
    <nav aria-label="Portfolio sections">
      <div
        className={mobile ? 'grid grid-cols-3 gap-2 sm:grid-cols-6' : 'flex flex-col gap-1'}
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

function PortfolioShell({ sections, profile }) {
  const [activeId, setActiveId] = useState('overview')
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

  useEffect(() => {
    const setFromLocation = (options = {}) => {
      const { shouldFocus = false, shouldScroll = false } = options
      const fragment = window.location.hash.slice(1)
      const route = resolveFragment(fragment, sections)

      if (route.replaceFragment) {
        window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}#${route.replaceFragment}`)
      }

      setActiveId(route.sectionId)

      if (shouldFocus || shouldScroll) {
        window.requestAnimationFrame(() => {
          window.requestAnimationFrame(() => {
            const panel = document.getElementById(route.sectionId)
            const target = document.getElementById(route.targetId) || panel
            target?.scrollIntoView({ block: 'start', behavior: 'auto' })
            if (shouldFocus && target) {
              if (target !== panel && !target.matches('a[href], button, input, select, textarea, [tabindex]')) {
                target.setAttribute('tabindex', '-1')
              }
              target.focus({ preventScroll: true })
            }
          })
        })
      }
    }

    setFromLocation({ shouldScroll: Boolean(window.location.hash) })
    setEnhanced(true)

    const handleHashChange = () => setFromLocation({ shouldFocus: true, shouldScroll: true })
    const handlePopState = () => setFromLocation({ shouldScroll: true })
    window.addEventListener('hashchange', handleHashChange)
    window.addEventListener('popstate', handlePopState)
    return () => {
      window.removeEventListener('hashchange', handleHashChange)
      window.removeEventListener('popstate', handlePopState)
    }
  }, [sections])

  const handleTabClick = (id) => {
    setActiveId(id)
    if (window.location.hash === `#${id}`) {
      window.requestAnimationFrame(() => document.getElementById(id)?.focus({ preventScroll: true }))
    }
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
    setActiveId(nextId)
    window.history.pushState(null, '', `#${nextId}`)
    document.getElementById(`${instanceId}-tab-${nextId}`)?.focus()
  }

  const activeLabel = sections.find(({ id }) => id === activeId)?.label || 'Overview'

  return (
    <div className="grid min-h-screen bg-canvas text-ink lg:grid-cols-[260px_minmax(0,1fr)]">
      <aside className="flex items-center justify-between gap-4 border-b border-white/10 bg-ink px-4 py-3 text-paper sm:px-6 lg:sticky lg:top-0 lg:row-span-2 lg:h-screen lg:flex-col lg:items-stretch lg:justify-between lg:border-b-0 lg:border-r lg:px-6 lg:py-8">
        <div className="flex min-w-0 items-center gap-3 lg:block">
          <div aria-hidden="true" className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/5 font-mono text-sm font-medium tracking-[-0.06em] text-sage lg:size-12">TH</div>
          <div className="min-w-0 lg:mt-5">
            <p className="mb-1 hidden font-mono text-[10px] font-medium uppercase tracking-[0.15em] text-sage lg:block">Backend / Software Engineer</p>
            <h1 className="truncate text-lg font-semibold tracking-[-0.04em] text-paper sm:text-xl lg:whitespace-normal lg:text-[27px] lg:leading-tight">{profile.name}</h1>
            <p className="mt-0.5 truncate text-[11px] text-paper/60 sm:text-xs lg:hidden">Backend / Software Engineer</p>
            <p className="mt-2 hidden max-w-[205px] text-sm leading-6 text-paper/60 lg:block">Computer Science<br />National University of Singapore</p>
            <p className="mt-1 hidden font-mono text-[10px] uppercase tracking-[0.14em] text-paper/70 lg:block">Singapore</p>
          </div>
        </div>

        <div className="lg:hidden">
          <SocialLinks profile={profile} mobile />
        </div>

        <div className="hidden lg:block">
          <div className="mb-3 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-paper/70">Sections</div>
          <PortfolioNavigation
            sections={sections}
            activeId={activeId}
            enhanced={enhanced}
            onTabClick={handleTabClick}
            onTabKeyDown={handleTabKeyDown}
            instanceId="desktop"
          />
        </div>

        <div className="hidden border-t border-white/10 pt-5 lg:block">
          <SocialLinks profile={profile} />
          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.12em] text-paper/70">Singapore &middot; NUS Computer Science</p>
        </div>
      </aside>

      <div className="min-w-0 lg:col-start-2">
        <div className="sticky top-0 z-20 border-b border-line bg-canvas px-4 py-3 sm:px-6 lg:hidden">
          <PortfolioNavigation
            sections={sections}
            activeId={activeId}
            enhanced={enhanced}
            onTabClick={handleTabClick}
            onTabKeyDown={handleTabKeyDown}
            instanceId="mobile"
            mobile
          />
        </div>

        <header className="flex min-h-[68px] items-center justify-between gap-4 border-b border-line px-5 py-3 sm:px-8 lg:px-12 2xl:px-16">
          <p className="min-w-0 truncate font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-muted sm:text-[11px]">
            <span className="text-ink">Portfolio</span>
            <span className="mx-2 text-line" aria-hidden="true">/</span>
            <span aria-live="polite">{activeLabel}</span>
          </p>
          <ActionLink href={profile.resume} target="_blank" rel="noopener noreferrer" className="shrink-0 px-3 py-2 text-xs sm:px-4 sm:text-sm">
            Resume
          </ActionLink>
        </header>

        <div className="mx-auto min-h-[calc(100vh-128px)] w-full max-w-[1500px] px-5 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-12 2xl:px-16 2xl:py-14">
          {sections.map(({ id, content }) => (
            <section
              key={id}
              id={id}
              className="min-w-0 scroll-mt-40 lg:scroll-mt-6"
              role={enhanced ? 'tabpanel' : undefined}
              aria-labelledby={enhanced ? `${desktopNavigation ? 'desktop' : 'mobile'}-tab-${id}` : undefined}
              tabIndex={enhanced ? 0 : undefined}
              hidden={enhanced && activeId !== id}
            >
              {legacyAnchorIds[id] ? <span id={legacyAnchorIds[id]} aria-hidden="true" className="sr-only" /> : null}
              {content}
            </section>
          ))}
        </div>

        <footer className="border-t border-line px-5 py-5 text-center sm:px-8 lg:px-12 2xl:px-16">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">&copy; Tran Ha Thu &middot; Built with care in Singapore</p>
        </footer>
      </div>
    </div>
  )
}

PortfolioShell.propTypes = {
  sections: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    content: PropTypes.node.isRequired,
  })).isRequired,
  profile: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    github: PropTypes.string.isRequired,
    linkedin: PropTypes.string.isRequired,
    resume: PropTypes.string.isRequired,
    education: PropTypes.shape({
      institution: PropTypes.string.isRequired,
      abbreviation: PropTypes.string.isRequired,
      programme: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
}

export default PortfolioShell
