import { useEffect, useState } from "react"
import PropTypes from "prop-types"
import { ActionLink, Badge, Panel } from "../ui"
import { projects } from "../../data/portfolio"

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
    <div className="min-w-0 scroll-mt-40 lg:scroll-mt-6" id={`project-${project.id}`} aria-labelledby={`project-heading-${project.id}`} tabIndex={-1}>
      <Panel className="p-5 sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="mb-2 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">{project.category}</p>
          <h3 id={`project-heading-${project.id}`} className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">{project.title}</h3>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs text-muted">{String(projects.findIndex((entry) => entry.id === project.id) + 1).padStart(2, "0")} / 06</span>
          {codeLink && <ActionLink href={codeLink.href} variant="secondary" target="_blank" rel="noreferrer noopener" className="min-h-11 px-3 py-2 text-xs">View code</ActionLink>}
        </div>
      </div>

      <div className="mt-5 flex h-[170px] items-center justify-center overflow-hidden rounded-xl border border-line bg-canvas p-3 sm:h-[220px]">
        <img className="h-full w-full object-contain" src={project.image} alt={project.imageAlt} width={project.imageWidth} height={project.imageHeight} loading="lazy" decoding="async" />
      </div>

      <p className="mt-5 text-base leading-relaxed text-ink">{project.summary}</p>
      <p className="mt-3 text-sm leading-relaxed text-muted">{project.description}</p>
      <div className="mt-5 rounded-xl border border-line bg-canvas px-4 py-3">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-muted">Implementation</p>
        <dl className="mt-2 grid gap-x-4 gap-y-2 sm:grid-cols-2">
          {project.implementation.map((item) => (
            <div key={item.label} className="min-w-0 border-t border-line pt-2 first:border-0 first:pt-0 sm:first:border-t sm:first:pt-2">
              <dt className="font-mono text-[9px] font-semibold uppercase tracking-[0.12em] text-muted">{item.label}</dt>
              <dd className="mt-0.5 break-words text-sm font-semibold text-ink">{item.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label={`${project.title} technologies`}>
        {project.skills.map((skill) => <Badge key={skill} tone="neutral">{skill}</Badge>)}
      </div>

      <div className="mt-5 border-t border-line pt-3">
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
  const [enhanced, setEnhanced] = useState(false)
  const [activeCategory, setActiveCategory] = useState("All")
  const [selectedId, setSelectedId] = useState("foroom")
  const visibleProjects = activeCategory === "All" ? projects : projects.filter((project) => project.category === activeCategory)
  const selectedProject = visibleProjects.find((project) => project.id === selectedId) || visibleProjects[0]

  useEffect(() => setEnhanced(true), [])

  useEffect(() => {
    function syncSelectionFromLocation() {
      const project = projects.find((entry) => window.location.hash === `#project-${entry.id}`)
      if (!project) return
      setActiveCategory((current) => current !== "All" && project.category !== current ? "All" : current)
      setSelectedId(project.id)
    }

    syncSelectionFromLocation()
    window.addEventListener("hashchange", syncSelectionFromLocation)
    window.addEventListener("popstate", syncSelectionFromLocation)
    return () => {
      window.removeEventListener("hashchange", syncSelectionFromLocation)
      window.removeEventListener("popstate", syncSelectionFromLocation)
    }
  }, [])

  function chooseCategory(category) {
    const nextProjects = category === "All" ? projects : projects.filter((project) => project.category === category)
    setActiveCategory(category)
    if (!nextProjects.some((project) => project.id === selectedId)) {
      const nextId = nextProjects[0]?.id || ""
      setSelectedId(nextId)
      if (nextId) window.history.replaceState(window.history.state, "", `#project-${nextId}`)
    }
  }

  function chooseProject(projectId) {
    setSelectedId(projectId)
    if (window.location.hash !== `#project-${projectId}`) window.location.hash = `#project-${projectId}`
  }

  const displayProjects = (project) => <ProjectDetails key={project.id} project={project} />

  if (!enhanced) {
    return (
      <div className="space-y-5">
        {projects.map(displayProjects)}
      </div>
    )
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap gap-2" role="group" aria-label="Filter projects">
        {categories.map((category) => {
          const count = category === "All" ? projects.length : projects.filter((project) => project.category === category).length
          const selected = activeCategory === category
          return (
            <button key={category} type="button" aria-pressed={selected} onClick={() => chooseCategory(category)} className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${selected ? "border-ink bg-ink text-paper" : "border-line bg-paper text-ink hover:border-ink"}`}>
              {category}<span className={`font-mono text-[10px] ${selected ? "text-paper/70" : "text-muted"}`}>{count}</span>
            </button>
          )
        })}
      </div>

      {visibleProjects.length === 0 ? (
        <Panel className="p-6 text-sm text-muted">No projects are listed in this category yet.</Panel>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[minmax(180px,0.38fr)_minmax(0,0.82fr)] lg:items-start">
          <nav className="grid grid-cols-2 gap-2 pb-2 sm:grid-cols-3 lg:sticky lg:top-6 lg:flex lg:flex-col lg:overflow-visible lg:pb-0" aria-label="Choose a project">
            {visibleProjects.map((project, index) => {
              const selected = selectedProject?.id === project.id
              return (
                <button key={project.id} type="button" aria-pressed={selected} onClick={() => chooseProject(project.id)} className={`flex min-h-11 min-w-0 items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-sm font-bold leading-tight transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent lg:w-full ${selected ? "border-ink bg-ink text-paper" : "border-line bg-paper text-ink hover:border-ink"}`}>
                  <span className={`font-mono text-[10px] ${selected ? "text-paper/70" : "text-muted"}`}>{String(index + 1).padStart(2, "0")}</span>
                  <span className="text-sm font-bold">{project.title}</span>
                </button>
              )
            })}
          </nav>
          <ProjectDetails key={selectedProject?.id} project={selectedProject} />
        </div>
      )}
    </div>
  )
}
