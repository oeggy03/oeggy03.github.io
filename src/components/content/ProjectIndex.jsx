import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { SectionHeading } from '../ui/index.jsx'
import { projects } from '../../data/portfolio.js'
import FeaturedProjectCard from './FeaturedProjectCard.jsx'
import { projectPathFor } from '../../navigation/routes.js'

const categories = ['All', 'Backend', 'AI & bots', 'Frontend']
const featuredProjects = projects.filter(({ featured }) => featured)
const existingProjects = projects.filter(({ featured }) => !featured)

function ProjectCard({ project }) {
  return (
    <article className="flex min-w-0 flex-wrap items-start gap-4 rounded-2xl bg-paper p-4 ring-1 ring-line/70 sm:items-center sm:gap-5 sm:p-5">
      <div className="flex aspect-video w-full items-center justify-center overflow-hidden rounded-xl bg-surface p-2 sm:size-28 sm:shrink-0 sm:aspect-square">
        <img src={project.image} alt={project.imageAlt} width={project.imageWidth} height={project.imageHeight}
          className="max-h-full max-w-full object-contain" loading="lazy" decoding="async" />
      </div>
      <div data-project-card-copy className="flex min-w-0 flex-[1_1_16rem] flex-col items-start">
        <p className="text-sm font-medium text-muted">{project.category}</p>
        <h3 className="mt-1 text-xl font-semibold tracking-tight text-ink">{project.title}</h3>
        <p className="mt-2 text-base leading-7 text-muted">{project.summary}</p>
        <a href={projectPathFor(project.id)} className="mt-3 inline-flex min-h-11 min-w-11 items-center whitespace-nowrap rounded-full px-1 text-sm font-semibold text-accent-ink underline decoration-accent underline-offset-4 hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
          View project
        </a>
      </div>
    </article>
  )
}

ProjectCard.propTypes = { project: PropTypes.object.isRequired }

export default function ProjectIndex({ activeCategory, onCategoryChange }) {
  const [enhanced, setEnhanced] = useState(false)
  useEffect(() => setEnhanced(true), [])

  const filteredFeatured = activeCategory === 'All' ? featuredProjects : featuredProjects.filter(({ category }) => category === activeCategory)
  const filteredExisting = activeCategory === 'All' ? existingProjects : existingProjects.filter(({ category }) => category === activeCategory)

  return (
    <div data-project-index className="min-w-0 space-y-10">
      <SectionHeading eyebrow="Selected work" title="Projects" description="A mix of personal experiments and earlier applications, with direct access to project details and source links." />

      {enhanced && (
        <div className="flex min-w-0 flex-wrap gap-2" role="group" aria-label="Filter projects">
          {categories.map((category) => {
            const count = category === 'All' ? projects.length : projects.filter((project) => project.category === category).length
            const selected = activeCategory === category
            return (
              <button key={category} type="button" aria-pressed={selected} onClick={() => onCategoryChange(category)} className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-colors duration-150 motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${selected ? 'border-ink bg-ink text-paper' : 'border-line bg-paper text-ink hover:border-ink'}`}>
                {category}<span className={`text-xs font-medium ${selected ? 'text-paper/80' : 'text-muted'}`}>{count}</span>
              </button>
            )
          })}
        </div>
      )}

      {filteredFeatured.length > 0 && (
        <section aria-labelledby="featured-projects-heading">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-muted">Personal work</p>
              <h3 id="featured-projects-heading" className="mt-1 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">Currently exploring</h3>
            </div>
          </div>
          <div className="grid min-w-0 gap-5 xl:grid-cols-2">
            {filteredFeatured.map((project) => <FeaturedProjectCard key={project.id} project={project} />)}
          </div>
        </section>
      )}

      {filteredExisting.length > 0 && (
        <section aria-labelledby="other-projects-heading">
          <h3 id="other-projects-heading" className="mb-5 text-2xl font-semibold tracking-tight text-ink">Other projects</h3>
          <div className="grid min-w-0 gap-4 lg:grid-cols-2">
            {filteredExisting.map((project) => <ProjectCard key={project.id} project={project} />)}
          </div>
        </section>
      )}
    </div>
  )
}

ProjectIndex.propTypes = {
  activeCategory: PropTypes.oneOf(categories).isRequired,
  onCategoryChange: PropTypes.func.isRequired,
}
