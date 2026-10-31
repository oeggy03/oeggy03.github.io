import PropTypes from 'prop-types'
import { ActionLink } from '../ui/index.jsx'
import { projectPathFor } from '../../navigation/routes.js'

export default function FeaturedProjectCard({ project, compact = false, featuredOnExperience = false }) {
  const titleSize = compact ? 'text-xl' : featuredOnExperience ? 'text-2xl' : 'text-2xl sm:text-3xl'
  const summarySize = featuredOnExperience ? 'text-[0.9375rem] leading-7' : 'text-base leading-7'

  return (
    <article className={`min-w-0 overflow-hidden rounded-2xl bg-paper ring-1 ring-line/70 ${compact ? '' : 'flex flex-col'}`}>
      <div className={`flex items-center justify-center overflow-hidden bg-surface p-3 ${compact ? 'aspect-video max-h-44' : 'aspect-video max-h-[280px] sm:p-5'}`}>
        <img src={project.image} alt={project.imageAlt} width={project.imageWidth} height={project.imageHeight}
          className="max-h-full max-w-full object-contain" loading="lazy" decoding="async" />
      </div>
      <div className={`flex min-w-0 flex-1 flex-col ${compact ? 'p-4' : 'p-5 sm:p-6'}`}>
        <p className="text-sm font-medium text-muted">{project.category}</p>
        <h3 className={`mt-1 font-semibold tracking-tight text-ink ${titleSize}`}>{project.title}</h3>
        <p className={`mt-3 ${summarySize} text-muted`}>{project.summary}</p>
        <div className="mt-5">
          <ActionLink href={projectPathFor(project.id)} variant="primary" showArrow={false} className="min-w-11 w-fit max-w-full rounded-full px-2 whitespace-normal break-normal text-center">
            Explore project
          </ActionLink>
        </div>
      </div>
    </article>
  )
}

FeaturedProjectCard.propTypes = {
  project: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    imageAlt: PropTypes.string.isRequired,
    imageWidth: PropTypes.number.isRequired,
    imageHeight: PropTypes.number.isRequired,
    summary: PropTypes.string.isRequired,
  }).isRequired,
  compact: PropTypes.bool,
  featuredOnExperience: PropTypes.bool,
}
