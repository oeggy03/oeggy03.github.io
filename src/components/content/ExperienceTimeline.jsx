import { ArrowUpRight, ChevronDown } from 'lucide-react'
import PropTypes from 'prop-types'
import { Badge } from '../ui'
import { currentExperienceId, experiences } from '../../data/portfolio'

const timeline = [...experiences].sort((a, b) => {
  if (a.id === currentExperienceId) return -1
  if (b.id === currentExperienceId) return 1
  return (b.endedAt ?? b.startedAt).localeCompare(a.endedAt ?? a.startedAt)
})
const currentExperience = timeline.find(({ id }) => id === currentExperienceId)
const earlierExperiences = timeline.filter(({ id }) => id !== currentExperienceId)
const earlierEmployerNames = earlierExperiences.map(({ company }) => company).join(', ')

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function formatMonthYear(value) {
  const [year, month] = value.split('-')
  return `${months[Number(month) - 1]} ${year}`
}

function ExperienceDates({ experience }) {
  return (
    <span className="inline-flex flex-wrap items-baseline gap-x-2 text-lg font-medium leading-7 text-muted md:justify-end md:text-right">
      <time dateTime={experience.startedAt}>{formatMonthYear(experience.startedAt)}</time>
      <span aria-hidden="true">–</span><span className="sr-only">to</span>
      {experience.endedAt
        ? <time dateTime={experience.endedAt}>{formatMonthYear(experience.endedAt)}</time>
        : <span>Present</span>}
    </span>
  )
}

ExperienceDates.propTypes = {
  experience: PropTypes.shape({
    startedAt: PropTypes.string.isRequired,
    endedAt: PropTypes.string,
  }).isRequired,
}

function ExperienceEntry({ experience }) {
  return (
    <li data-experience-id={experience.id} className="grid min-w-0 gap-x-8 gap-y-2 py-6 first:pt-0 last:pb-0 sm:py-7 md:grid-cols-[minmax(155px,0.7fr)_minmax(0,2fr)] md:gap-y-0 md:py-8">
      <div className="md:pt-1"><ExperienceDates experience={experience} /></div>
      <article className="min-w-0">
        <div className="flex min-w-0 flex-wrap items-start gap-3 sm:gap-4">
          {experience.logo && experience.url && (
            <a className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-white p-1.5 ring-1 ring-line focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent" href={experience.url} target="_blank" rel="noreferrer noopener" aria-label={`${experience.company} website`}>
              <img className="max-h-full max-w-full object-contain" src={experience.logo} alt={experience.logoAlt} width="64" height="64" loading="lazy" decoding="async" />
            </a>
          )}
          <div className="min-w-0 flex-1">
            <h3 className="break-words text-lg font-semibold leading-snug tracking-tight text-ink sm:text-xl">{experience.role || experience.company}</h3>
            {experience.role && (
              experience.url
                ? <a href={experience.url} target="_blank" rel="noreferrer noopener" className="mt-1 inline-flex min-h-11 min-w-11 max-w-full flex-wrap items-center gap-1 [overflow-wrap:anywhere] text-base leading-6 text-muted underline decoration-line underline-offset-4 hover:text-ink hover:decoration-accent focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"><span className="min-w-0 max-w-full [overflow-wrap:anywhere]">{experience.company}</span><ArrowUpRight aria-hidden="true" className="size-4 shrink-0" /></a>
                : <p className="mt-1 text-base leading-6 text-muted">{experience.company}</p>
            )}
          </div>
        </div>

        {experience.highlights?.length > 0 && (
          <ul className="mt-4 max-w-3xl list-disc space-y-2 pl-5 text-base leading-7 text-muted marker:text-line">
            {experience.highlights.map((highlight) => <li key={highlight} className="pl-1">{highlight}</li>)}
          </ul>
        )}
        {experience.skills?.length > 0 && (
          <ul className="mt-5 flex flex-wrap gap-2" aria-label={`${experience.role} skills`}>
            {experience.skills.map((skill) => <li key={skill}><Badge>{skill}</Badge></li>)}
          </ul>
        )}
      </article>
    </li>
  )
}

ExperienceEntry.propTypes = {
  experience: PropTypes.shape({
    id: PropTypes.string.isRequired,
    startedAt: PropTypes.string.isRequired,
    company: PropTypes.string.isRequired,
    role: PropTypes.string,
    endedAt: PropTypes.string,
    logo: PropTypes.string,
    logoAlt: PropTypes.string,
    url: PropTypes.string,
    highlights: PropTypes.arrayOf(PropTypes.string),
    skills: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
}

function EmployerLogoPreview() {
  return (
    <span
      role="img"
      aria-label={`Earlier employers: ${earlierEmployerNames}`}
      title={`Earlier employers: ${earlierEmployerNames}`}
      className="flex w-full flex-wrap items-center gap-1.5 sm:w-auto"
    >
      {earlierExperiences.map(({ id, company, logo, logoAlt }) => (
        <span key={id} className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white p-1 ring-1 ring-line" title={company}>
          <img src={logo} alt={logoAlt} aria-hidden="true" className="max-h-full max-w-full object-contain" width="64" height="64" loading="lazy" decoding="async" />
        </span>
      ))}
    </span>
  )
}

export default function ExperienceView() {
  return (
    <section id="work-history" aria-labelledby="experience-heading" className="scroll-mt-32">
      <div className="mb-7 flex flex-wrap items-end justify-between gap-x-8 gap-y-3 border-b border-line pb-5 sm:mb-10 sm:pb-7">
        <h2 id="experience-heading" className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">Experience</h2>
        <p className="max-w-xl text-base leading-7 text-muted">My work so far.</p>
      </div>

      <ol aria-label="Current role" className="divide-y divide-line">
        {currentExperience && <ExperienceEntry experience={currentExperience} />}
      </ol>

      <details className="group mt-6 border-y border-line">
        <summary className="flex min-h-11 list-none cursor-pointer flex-wrap items-center gap-x-4 gap-y-3 py-4 text-left focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent [&::-webkit-details-marker]:hidden">
          <span className="text-lg font-semibold tracking-tight text-ink">I also engineered at</span>
          <EmployerLogoPreview />
          <span className="inline-flex min-h-11 min-w-0 max-w-full flex-wrap items-center gap-x-2 gap-y-1 text-sm font-semibold text-accent-ink">
            <span className="group-open:hidden">View earlier experience</span>
            <span className="hidden group-open:inline">Hide earlier experience</span>
            <ChevronDown aria-hidden="true" className="size-4 group-open:rotate-180" />
          </span>
        </summary>
        <ol id="earlier-experience" aria-label="Earlier roles in reverse chronological order" className="divide-y divide-line pb-6">
          {earlierExperiences.map((experience) => <ExperienceEntry key={experience.id} experience={experience} />)}
        </ol>
      </details>
    </section>
  )
}
