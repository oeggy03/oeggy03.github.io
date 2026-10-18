import { ArrowUpRight } from "lucide-react"
import { Badge, Panel, SectionHeading } from "../components/ui"
import { experiences } from "../data/portfolio"

export default function ExperienceView() {
  return (
    <div className="space-y-7">
      <SectionHeading
        eyebrow="Work & teaching"
        title="Experience"
        description="Engineering, data and teaching experience across industry and research."
      />

      <div className="grid gap-4 xl:grid-cols-2">
        {experiences.map((experience, index) => (
          <Panel key={experience.id} className="flex h-full flex-col !p-5 sm:!p-6">
            <div className="flex items-start gap-4">
              <a className="flex size-14 shrink-0 items-center justify-center rounded-xl border border-line bg-canvas p-2 transition-colors hover:border-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent" href={experience.url} target="_blank" rel="noreferrer noopener" aria-label={`${experience.company} website`}>
                <img className="max-h-full max-w-full object-contain" src={experience.logo} alt={experience.logoAlt} width="80" height="80" loading="lazy" decoding="async" />
              </a>
              <div className="min-w-0 flex-1">
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">{String(index + 1).padStart(2, "0")} / {experience.dates}</p>
                <h3 className="mt-1.5 text-lg font-bold leading-snug tracking-tight text-ink">{experience.role}</h3>
                <a href={experience.url} target="_blank" rel="noreferrer noopener" className="mt-1 inline-flex min-h-11 items-center gap-1 text-sm font-medium text-muted underline decoration-line underline-offset-4 hover:text-ink hover:decoration-accent focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
                  {experience.company}<ArrowUpRight aria-hidden="true" className="size-3.5 shrink-0" />
                </a>
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-muted">{experience.summary}</p>
            <div className="mt-4 flex flex-wrap gap-2 border-t border-line pt-4">
              {experience.skills.map((skill) => <Badge key={skill} tone="neutral">{skill}</Badge>)}
            </div>
          </Panel>
        ))}
      </div>
    </div>
  )
}
