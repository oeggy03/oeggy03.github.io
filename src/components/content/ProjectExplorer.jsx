import PropTypes from 'prop-types'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { ActionLink, Badge, Panel } from '../ui/index.jsx'
import { projectGroups, projects } from '../../data/portfolio.js'
import ExpandableImage from '../ui/ExpandableImage.jsx'
import { usePortfolioNavigation } from '../../navigation/NavigationContext.jsx'
import { projectInfoPathFor, projectPathFor, resolvePortfolioRoute, sectionPathFor } from '../../navigation/routes.js'

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

function CapabilitiesAtGlance({ projectId, capabilities }) {
  return (
    <section data-capabilities-at-a-glance className="mt-7 border-t border-line pt-5" aria-labelledby={`capabilities-glance-${projectId}`}>
      <h3 id={`capabilities-glance-${projectId}`} className="text-xl font-semibold tracking-tight text-ink">Capabilities at a glance</h3>
      <ul className="mt-4 divide-y divide-line border-y border-line">
        {capabilities.map((capability) => (
          <li key={capability.title} className="py-4">
            <h4 className="text-base font-semibold text-ink">{capability.title}</h4>
            <p className="mt-1 text-sm leading-6 text-muted">{capability.text}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}

CapabilitiesAtGlance.propTypes = {
  projectId: PropTypes.string.isRequired,
  capabilities: PropTypes.arrayOf(PropTypes.shape({
      title: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
    })).isRequired,
}

function ProjectDetails({ project }) {
  const codeLink = project.links.find((link) => /back.?end/i.test(link.label))
    || project.links.find((link) => link.href.startsWith('https://github.com/') && !link.href.includes('/releases/'))
  const projectCodeLink = project.id === 'openclaw' ? null : codeLink

  return (
    <div className="min-w-0 scroll-mt-36 lg:scroll-mt-28" id={`project-${project.id}`} aria-labelledby={`project-heading-${project.id}`} tabIndex={-1}>
      <Panel className="p-4 sm:p-7">
        <div className={`flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between ${project.caseStudy ? '' : 'sm:flex-wrap'}`}>
          <div className="min-w-0 flex-1">
            <p className="mb-1.5 text-base font-medium text-muted">{project.category}</p>
            <h2 id={`project-heading-${project.id}`} tabIndex={-1} className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">{project.title}</h2>
            <a href={sectionPathFor('projects')} className="mt-1 inline-flex min-h-11 min-w-11 items-center text-sm font-semibold text-muted underline decoration-line underline-offset-2 hover:text-ink hover:decoration-accent focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent lg:hidden">Back to projects</a>
          </div>
          {project.caseStudy ? (
            <div className="flex w-full shrink-0 flex-col gap-2 sm:w-auto sm:items-end">
              <ActionLink href={projectInfoPathFor(project.id)} showArrow={false} className="w-full break-normal px-3 py-3 text-base sm:w-auto sm:px-4" aria-label={`Read full project writeup for ${project.title}`}>
                <span className="inline-flex items-center gap-2 break-normal">Read full project<ArrowRight aria-hidden="true" className="hidden size-4 shrink-0 sm:block" /></span>
              </ActionLink>
              {projectCodeLink && <ActionLink href={projectCodeLink.href} variant="secondary" showArrow={false} target="_blank" rel="noreferrer noopener" className="w-full min-h-11 break-normal px-3 py-2 text-sm sm:w-auto">View code</ActionLink>}
            </div>
          ) : projectCodeLink && <ActionLink href={projectCodeLink.href} variant="secondary" target="_blank" rel="noreferrer noopener" className="min-h-11 px-3 py-2 text-xs">View code</ActionLink>}
        </div>

        <div className="mt-7 flex aspect-video max-h-[360px] items-center justify-center overflow-hidden rounded-2xl bg-surface p-3 sm:p-5">
          <ExpandableImage src={project.image} alt={project.imageAlt} width={project.imageWidth} height={project.imageHeight}
            linkClassName="flex h-full w-full items-center justify-center" imageClassName="h-full w-full object-contain" loading="lazy" />
        </div>

        <p className="mt-4 text-base leading-relaxed text-ink">{project.summary}</p>
        {(project.description || project.caseStudy?.architecture?.summary) && <p className="mt-2 text-sm leading-relaxed text-muted">{project.description || project.caseStudy.architecture.summary}</p>}
        {project.overviewCapabilities && <CapabilitiesAtGlance projectId={project.id} capabilities={project.overviewCapabilities} />}
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
  const route = resolvePortfolioRoute(fragment)
  const fragmentProject = projects.find((project) => route.projectId === project.id)
  const selectedProject = fragmentProject || projects.find((project) => project.id === 'foroom')

  function chooseProject(projectId) {
    navigate(`project-${projectId}`, { scroll: 'project', focus: 'project' })
  }

  return (
    <div data-project-explorer className="min-w-0">
      <div className="grid min-w-0 gap-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-start">
        <nav className="flex min-w-0 flex-wrap gap-x-4 gap-y-5 border-b border-line pb-4 lg:sticky lg:top-[112px] lg:flex-col lg:flex-nowrap lg:gap-4 lg:border-b-0 lg:pb-0" aria-label="Choose a project">
          {projectGroups.map((group) => (
            <section key={group.id} data-project-group={group.id} aria-labelledby={`project-group-${group.id}`} className="min-w-0 w-full sm:w-[calc(50%-0.5rem)] lg:w-full">
              <h3 id={`project-group-${group.id}`} className="mb-1.5 px-3 text-xs font-semibold leading-5 text-muted">{group.title}</h3>
              <ul className="grid min-w-0 grid-cols-2 gap-1 sm:grid-cols-3 lg:grid-cols-1">
                {group.projects.map((project) => {
                  const selected = selectedProject?.id === project.id
                  return (
                    <li key={project.id} className="min-w-0">
                      <a href={projectPathFor(project.id)} aria-current={fragmentProject?.id === project.id ? 'page' : undefined} onClick={(event) => {
                        if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.currentTarget.target || event.currentTarget.hasAttribute('download')) return
                        event.preventDefault()
                        chooseProject(project.id)
                      }} className={`flex min-h-11 min-w-0 items-center rounded-lg px-3 text-left text-sm font-medium leading-tight transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent lg:w-full ${selected ? 'bg-surface font-semibold text-ink underline decoration-accent decoration-2 underline-offset-4' : 'text-muted hover:bg-surface hover:text-ink'}`}>
                        <span className="min-w-0 [overflow-wrap:anywhere]">{project.title}</span>
                      </a>
                    </li>
                  )
                })}
              </ul>
            </section>
          ))}
        </nav>
        <ProjectDetails key={selectedProject?.id} project={selectedProject} />
      </div>
    </div>
  )
}
