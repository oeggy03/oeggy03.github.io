import PropTypes from 'prop-types'
import { ArrowUpRight } from 'lucide-react'
import { ActionLink, Badge, Panel } from '../ui/index.jsx'
import { projects } from '../../data/portfolio.js'
import { usePortfolioNavigation } from '../../navigation/NavigationContext.jsx'
import { projectPathFor, sectionPathFor } from '../../navigation/routes.js'

function ProjectLinks({ links }) {
  return (
    <ul className="flex flex-wrap gap-x-5 gap-y-2">
      {links.map((link) => (
        <li key={link.href}>
          <a className="inline-flex min-h-11 min-w-11 items-center gap-1.5 text-sm font-semibold text-ink underline decoration-accent underline-offset-4 transition-colors hover:text-accent-ink focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent" href={link.href} target="_blank" rel="noreferrer noopener">
            {link.label}<ArrowUpRight aria-hidden="true" className="size-4" />
          </a>
        </li>
      ))}
    </ul>
  )
}

ProjectLinks.propTypes = {
  links: PropTypes.arrayOf(PropTypes.shape({ label: PropTypes.string.isRequired, href: PropTypes.string.isRequired })).isRequired,
}

function ProjectDetails({ project }) {
  const codeLink = project.links.find((link) => /back.?end/i.test(link.label))
    || project.links.find((link) => link.href.startsWith('https://github.com/') && !link.href.includes('/releases/'))

  return (
    <div className="min-w-0 scroll-mt-36 lg:scroll-mt-28" id={`project-${project.id}`} aria-labelledby={`project-heading-${project.id}`} tabIndex={-1}>
      <Panel className="p-4 sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="mb-1.5 text-base font-medium text-muted">{project.category}</p>
            <h2 id={`project-heading-${project.id}`} tabIndex={-1} className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">{project.title}</h2>
            <a href={sectionPathFor('projects')} className="mt-1 inline-flex min-h-11 min-w-11 items-center text-sm font-semibold text-muted underline decoration-line underline-offset-2 hover:text-ink hover:decoration-accent focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent lg:hidden">Back to projects</a>
          </div>
          {codeLink && <ActionLink href={codeLink.href} variant="secondary" target="_blank" rel="noreferrer noopener" className="min-h-11 px-3 py-2 text-xs">View code</ActionLink>}
        </div>

        <div className="mt-7 flex aspect-video max-h-[360px] items-center justify-center overflow-hidden rounded-2xl bg-surface p-3 sm:p-5">
          <img className="h-full w-full object-contain" src={project.image} alt={project.imageAlt} width={project.imageWidth} height={project.imageHeight} loading="lazy" decoding="async" />
        </div>

        <p className="mt-4 text-base leading-relaxed text-ink">{project.summary}</p>
        {project.description && <p className="mt-2 text-sm leading-relaxed text-muted">{project.description}</p>}
        {project.implementation?.length > 0 && (
          <div className="mt-7 rounded-xl bg-surface px-4 py-4 sm:px-5">
            <p className="text-sm font-semibold text-muted">Implementation</p>
            <dl className="mt-1.5 grid gap-x-4 gap-y-1.5 sm:grid-cols-2">
              {project.implementation.map((item) => (
                <div key={item.label} className="min-w-0 border-t border-line pt-1.5 first:border-0 first:pt-0 sm:first:border-t sm:first:pt-1.5">
                  <dt className="text-sm font-medium text-muted">{item.label}</dt>
                  <dd className="mt-0.5 break-words text-base font-semibold text-ink">{item.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        <ul className="mt-4 flex flex-wrap gap-2" aria-label={`${project.title} technologies`}>
          {project.skills.map((skill) => <li key={skill}><Badge tone="neutral">{skill}</Badge></li>)}
        </ul>

        <div className="mt-7 border-t border-line pt-3">
          <ProjectLinks links={project.links} />
        </div>
      </Panel>
    </div>
  )
}

ProjectDetails.propTypes = { project: PropTypes.object.isRequired }

export default function ProjectExplorer() {
  const { fragment, navigate } = usePortfolioNavigation()
  const fragmentProject = projects.find((project) => fragment === `project-${project.id}`)
  const selectedProject = fragmentProject || projects.find((project) => project.id === 'foroom')

  function chooseProject(projectId) {
    navigate(`project-${projectId}`, { scroll: 'project', focus: 'project' })
  }

  return (
    <div data-project-explorer className="min-w-0">
      <div className="grid min-w-0 gap-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-start">
        <nav className="grid grid-cols-2 gap-1 border-b border-line pb-4 sm:grid-cols-3 lg:sticky lg:top-[112px] lg:flex lg:flex-col lg:gap-1 lg:border-b-0 lg:pb-0" aria-label="Choose a project">
          {projects.map((project) => {
            const selected = selectedProject?.id === project.id
            return (
              <a key={project.id} href={projectPathFor(project.id)} aria-current={fragmentProject?.id === project.id ? 'page' : undefined} onClick={(event) => {
                if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.currentTarget.target || event.currentTarget.hasAttribute('download')) return
                event.preventDefault()
                chooseProject(project.id)
              }} className={`flex min-h-11 min-w-0 items-center rounded-lg px-3 text-left text-sm font-medium leading-tight transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent lg:w-full ${selected ? 'bg-surface font-semibold text-ink underline decoration-accent decoration-2 underline-offset-4' : 'text-muted hover:bg-surface hover:text-ink'}`}>
                <span className="min-w-0 [overflow-wrap:anywhere]">{project.title}</span>
              </a>
            )
          })}
        </nav>
        <ProjectDetails key={selectedProject?.id} project={selectedProject} />
      </div>
    </div>
  )
}
