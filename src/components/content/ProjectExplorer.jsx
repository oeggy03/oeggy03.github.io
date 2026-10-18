import { useEffect, useState } from "react"
import PropTypes from "prop-types"
import { ActionLink, Badge, Panel } from "../ui"
import { projects } from "../../data/portfolio"
import { usePortfolioNavigation } from "../../navigation/NavigationContext"
import { projectPathFor, sectionPathFor } from "../../navigation/routes"

const categories = ["All", "Backend", "AI & bots", "Frontend"]

function ProjectLinks({ links }) {
  return (
    <ul className="flex flex-wrap gap-x-5 gap-y-2">
      {links.map((link) => (
        <li key={link.href}>
          <a className="inline-flex min-h-11 items-center gap-1.5 text-sm font-bold text-ink underline decoration-accent decoration-2 underline-offset-4 transition-colors hover:text-accent-ink focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent" href={link.href} target="_blank" rel="noreferrer noopener">
            {link.label}<span aria-hidden="true">&#8599;</span>
          </a>
        </li>
      ))}
    </ul>
  )
}

ProjectLinks.propTypes = {
  links: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    href: PropTypes.string.isRequired,
  })).isRequired,
}

function ProjectDetails({ project }) {
  const codeLink = project.links.find((link) => /back.?end/i.test(link.label))
    || project.links.find((link) => link.href.startsWith("https://github.com/") && !link.href.includes("/releases/"))

  return (
    <div className="min-w-0 scroll-mt-36 lg:scroll-mt-[96px]" id={`project-${project.id}`} aria-labelledby={`project-heading-${project.id}`} tabIndex={-1}>
      <Panel className="p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="mb-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">{project.category}</p>
            <h3 id={`project-heading-${project.id}`} className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">{project.title}</h3>
            <a href={sectionPathFor("projects")} className="mt-1 inline-flex min-h-11 items-center text-sm font-semibold text-muted underline decoration-line underline-offset-2 hover:text-ink hover:decoration-accent focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent lg:hidden">Browse projects</a>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs text-muted">{String(projects.findIndex((entry) => entry.id === project.id) + 1).padStart(2, "0")} / 06</span>
            {codeLink && <ActionLink href={codeLink.href} variant="secondary" target="_blank" rel="noreferrer noopener" className="min-h-11 px-3 py-2 text-xs">View code</ActionLink>}
          </div>
        </div>

        <div className="mt-3 flex h-[150px] items-center justify-center overflow-hidden rounded-xl border border-line bg-canvas p-3 sm:h-[170px]">
          <img className="h-full w-full object-contain" src={project.image} alt={project.imageAlt} width={project.imageWidth} height={project.imageHeight} loading="lazy" decoding="async" />
        </div>

        <p className="mt-4 text-base leading-relaxed text-ink">{project.summary}</p>
        {project.description && <p className="mt-2 text-sm leading-relaxed text-muted">{project.description}</p>}
        {project.implementation?.length > 0 && (
          <div className="mt-4 rounded-xl border border-line bg-canvas px-4 py-3">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-muted">Implementation</p>
            <dl className="mt-1.5 grid gap-x-4 gap-y-1.5 sm:grid-cols-2">
              {project.implementation.map((item) => (
                <div key={item.label} className="min-w-0 border-t border-line pt-1.5 first:border-0 first:pt-0 sm:first:border-t sm:first:pt-1.5">
                  <dt className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">{item.label}</dt>
                  <dd className="mt-0.5 break-words text-sm font-semibold text-ink">{item.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label={`${project.title} technologies`}>
          {project.skills.map((skill) => <Badge key={skill} tone="neutral">{skill}</Badge>)}
        </div>

        <div className="mt-4 border-t border-line pt-2">
          <ProjectLinks links={project.links} />
        </div>
      </Panel>
    </div>
  )
}

ProjectDetails.propTypes = {
  project: PropTypes.object.isRequired,
}

export default function ProjectExplorer() {
  const { fragment, navigate } = usePortfolioNavigation()
  const [enhanced, setEnhanced] = useState(false)
  const [activeCategory, setActiveCategory] = useState("All")
  const fragmentProject = projects.find((project) => fragment === `project-${project.id}`)
  const categoryFromFragment = fragment === "projects"
    ? "All"
    : fragmentProject && activeCategory !== "All" && fragmentProject.category !== activeCategory
      ? "All"
      : activeCategory
  const visibleProjects = categoryFromFragment === "All" ? projects : projects.filter((project) => project.category === categoryFromFragment)
  const selectedProject = fragment === "projects"
    ? projects.find((project) => project.id === "foroom")
    : fragmentProject || projects.find((project) => project.id === "foroom")

  useEffect(() => setEnhanced(true), [])

  useEffect(() => {
    if (fragment === "projects") {
      setActiveCategory("All")
      return
    }

    const project = projects.find((entry) => fragment === `project-${entry.id}`)
    if (!project) return
    setActiveCategory((current) => current !== "All" && project.category !== current ? "All" : current)
  }, [fragment])

  function chooseCategory(category) {
    const nextProjects = category === "All" ? projects : projects.filter((project) => project.category === category)
    const nextProject = nextProjects.find((project) => project.id === selectedProject?.id) || nextProjects[0]
    setActiveCategory(category)
    if (!nextProject) return

    navigate(`project-${nextProject.id}`, { replace: true, scroll: "preserve", focus: "preserve" })
  }

  function chooseProject(projectId) {
    navigate(`project-${projectId}`, { scroll: "project", focus: "project" })
  }

  return (
    <div data-project-explorer>
      {enhanced && (
        <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label="Filter projects">
          {categories.map((category) => {
            const count = category === "All" ? projects.length : projects.filter((project) => project.category === category).length
            const selected = categoryFromFragment === category
            return (
              <button key={category} type="button" aria-pressed={selected} onClick={() => chooseCategory(category)} className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${selected ? "border-ink bg-ink text-paper" : "border-line bg-paper text-ink hover:border-ink"}`}>
                {category}<span className={`font-mono text-[10px] ${selected ? "text-paper/70" : "text-muted"}`}>{count}</span>
              </button>
            )
          })}
        </div>
      )}

      {visibleProjects.length === 0 ? (
        <Panel className="p-6 text-sm text-muted">No projects are listed in this category yet.</Panel>
      ) : (
        <div className="grid gap-3 lg:grid-cols-[200px_minmax(0,1fr)] lg:items-start">
          <nav className="grid grid-cols-2 gap-2 pb-1 lg:sticky lg:top-[96px] lg:flex lg:flex-col lg:overflow-visible lg:pb-0" aria-label="Choose a project">
            {visibleProjects.map((project, index) => {
              const selected = selectedProject?.id === project.id
              return (
                <a key={project.id} href={projectPathFor(project.id)} aria-current={fragmentProject?.id === project.id ? "page" : undefined} onClick={(event) => {
                  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.currentTarget.target || event.currentTarget.hasAttribute("download")) return
                  event.preventDefault()
                  chooseProject(project.id)
                }} className={`flex min-h-11 min-w-0 items-center gap-2 rounded-xl border px-3 py-2 text-left text-sm font-bold leading-tight transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent lg:w-full ${selected ? "border-ink bg-ink text-paper" : "border-line bg-paper text-ink hover:border-ink"}`}>
                  <span className={`font-mono text-[10px] ${selected ? "text-paper/70" : "text-muted"}`}>{String(index + 1).padStart(2, "0")}</span>
                  <span className="text-sm font-bold">{project.title}</span>
                </a>
              )
            })}
          </nav>
          <ProjectDetails key={selectedProject?.id} project={selectedProject} />
        </div>
      )}
    </div>
  )
}
