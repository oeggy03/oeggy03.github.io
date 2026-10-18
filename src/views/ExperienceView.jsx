import { ArrowUpRight } from "lucide-react"
import PropTypes from "prop-types"
import { Badge, Panel, SectionHeading } from "../components/ui"
import { currentExperienceId, experiences } from "../data/portfolio"

const timeline = [...experiences].sort((a, b) => {
  if (a.id === currentExperienceId) return -1
  if (b.id === currentExperienceId) return 1
  return (b.endedAt ?? b.startedAt).localeCompare(a.endedAt ?? a.startedAt)
})

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

function formatMonthYear(value) {
  const [year, month] = value.split("-")
  return `${months[Number(month) - 1]} ${year}`
}

function ExperienceDates({ experience }) {
  return (
    <span className="inline-flex flex-wrap items-baseline gap-x-1 sm:flex-col sm:items-end sm:gap-x-0 sm:gap-y-0.5">
      <time className="whitespace-nowrap" dateTime={experience.startedAt}>{formatMonthYear(experience.startedAt)}</time>
      <span className="inline-flex items-baseline gap-x-1 whitespace-nowrap">
        <span aria-hidden="true">–</span>
        <span className="sr-only">to</span>
        {experience.endedAt
          ? <time className="whitespace-nowrap" dateTime={experience.endedAt}>{formatMonthYear(experience.endedAt)}</time>
          : <span>Present</span>}
      </span>
    </span>
  )
}

ExperienceDates.propTypes = {
  experience: PropTypes.shape({
    startedAt: PropTypes.string.isRequired,
    endedAt: PropTypes.string,
  }).isRequired,
}

export default function ExperienceView() {
  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Work & teaching"
        title="Experience"
        description="Engineering, data and teaching experience across industry and research."
      />

      <ol aria-label="Experience in reverse chronological order" className="space-y-0">
        {timeline.map((experience) => (
          <li key={experience.id} data-experience-id={experience.id} className="grid grid-cols-[1rem_minmax(0,1fr)] grid-rows-[auto_auto] gap-x-3 gap-y-1 sm:grid-cols-[minmax(7rem,8rem)_1.25rem_minmax(0,1fr)] sm:grid-rows-1 sm:gap-x-4 sm:gap-y-0">
            <div className="col-start-2 row-start-1 pt-1 font-mono text-[10px] font-medium leading-4 text-muted sm:col-start-1 sm:pt-4 sm:text-right sm:text-xs">
              <ExperienceDates experience={experience} />
            </div>

            <div className="relative col-start-1 row-span-2 row-start-1 flex justify-center border-l border-line sm:col-start-2 sm:row-span-1 sm:row-start-1" aria-hidden="true">
              <span className={`absolute left-[-5px] top-[2rem] size-2.5 rounded-full border-2 border-paper sm:top-[1.15rem] ${experience.id === currentExperienceId ? "bg-ink" : "bg-muted"}`} />
            </div>

            <Panel className="col-start-2 row-start-2 mb-4 min-w-0 !p-4 sm:col-start-3 sm:row-start-1 sm:mb-5 sm:!p-5">
              <div className="flex min-w-0 items-start gap-3">
                {experience.logo && (
                  <a className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-line bg-canvas p-1.5 transition-colors hover:border-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent" href={experience.url} target="_blank" rel="noreferrer noopener" aria-label={`${experience.company} website`}>
                    <img className="max-h-full max-w-full object-contain" src={experience.logo} alt={experience.logoAlt} width="64" height="64" loading="lazy" decoding="async" />
                  </a>
                )}
                <div className="min-w-0 flex-1">
                  {experience.role ? (
                    <>
                      <h3 className="text-base font-bold leading-snug tracking-tight text-ink sm:text-lg">{experience.role}</h3>
                      {experience.url ? (
                        <a href={experience.url} target="_blank" rel="noreferrer noopener" className="mt-0.5 inline-flex min-h-9 items-center gap-1 text-sm font-medium leading-5 text-muted underline decoration-line underline-offset-4 transition-colors hover:text-ink hover:decoration-accent focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
                          {experience.company}<ArrowUpRight aria-hidden="true" className="size-3.5 shrink-0" />
                        </a>
                      ) : <p className="mt-0.5 text-sm font-medium leading-5 text-muted">{experience.company}</p>}
                    </>
                  ) : (
                    <h3 className="text-base font-bold leading-snug tracking-tight text-ink sm:text-lg">{experience.company}</h3>
                  )}
                </div>
              </div>

              {experience.highlights?.length > 0 && (
                <ul className="mt-2.5 space-y-1 text-sm leading-6 text-muted">
                  {experience.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}
                </ul>
              )}
              {experience.skills?.length > 0 && (
                <ul className="mt-3 flex flex-wrap gap-1.5 border-t border-line pt-3" aria-label={`${experience.role} skills`}>
                  {experience.skills.map((skill) => <li key={skill}><Badge tone="neutral">{skill}</Badge></li>)}
                </ul>
              )}
            </Panel>
          </li>
        ))}
      </ol>
    </div>
  )
}
