import { ArrowUpRight } from "lucide-react"
import { Panel } from "../components/ui"
import { experiences, profile } from "../data/portfolio"
import nusLogo from "../assets/NUS.png"

const currentExperience = experiences.find((experience) => experience.id === "hdb")

export default function OverviewView() {
  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(300px,0.85fr)] xl:items-center">
      <section className="min-w-0 xl:col-start-1 xl:row-start-1">
        <div className="min-w-0 py-1">
          <p className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-accent-ink sm:text-[11px]">
            {profile.role}
          </p>
          <h2 className="max-w-2xl text-4xl font-bold leading-[1.08] tracking-[-0.05em] text-ink sm:text-5xl">
            Building useful software with care.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted sm:text-[17px]">
            I&apos;m {profile.name}, a software engineer focused on backend development. I build applications with Go, Java and Python, with experience in data engineering and machine learning.
          </p>
        </div>
      </section>

      <section aria-label="Current role and education" className="grid min-w-0 gap-4 lg:grid-cols-2 xl:col-span-2 xl:row-start-2">
        <Panel className="flex min-w-0 items-start gap-4 !p-5 sm:!p-6">
          <a href={currentExperience.url} target="_blank" rel="noreferrer noopener" aria-label={`${currentExperience.company} website`} className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-line bg-canvas p-2 transition-colors hover:border-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:size-14">
            <img className="max-h-full max-w-full object-contain" src={currentExperience.logo} alt={currentExperience.logoAlt} width="80" height="80" loading="eager" decoding="async" />
          </a>
          <div className="min-w-0 flex-1">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-accent-ink">Current role</p>
            <h3 className="mt-1 text-base font-bold leading-snug text-ink">{currentExperience.role}</h3>
            <a href={currentExperience.url} target="_blank" rel="noreferrer noopener" className="mt-1 inline-flex min-h-11 items-center gap-1 text-sm font-medium text-muted underline decoration-line underline-offset-4 transition-colors hover:text-ink hover:decoration-accent focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
              {currentExperience.company}
              <ArrowUpRight aria-hidden="true" className="size-3.5 shrink-0" />
            </a>
            <p className="font-mono text-xs text-muted">{currentExperience.dates}</p>
            <p className="mt-2 text-sm leading-6 text-muted">{currentExperience.summary}</p>
          </div>
        </Panel>

        <Panel className="flex min-w-0 items-start gap-4 !p-5 sm:!p-6">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-line bg-paper p-2 sm:size-14">
            <img className="max-h-full max-w-full object-contain" src={nusLogo} alt="" width="80" height="80" loading="eager" decoding="async" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">Education</p>
            <a href={profile.education.url} target="_blank" rel="noreferrer noopener" className="mt-1 inline-flex min-h-11 items-center gap-1 text-base font-bold leading-snug text-ink underline decoration-line underline-offset-4 transition-colors hover:decoration-accent focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
              {profile.education.institution}
              <ArrowUpRight aria-hidden="true" className="size-4 shrink-0 text-muted" />
            </a>
            <p className="mt-1 text-sm font-medium text-ink">{profile.education.programme}</p>
            <p className="mt-2 text-sm leading-6 text-muted">Minors: {profile.education.minors.join(" · ")}</p>
          </div>
        </Panel>
      </section>

      <Panel className="xl:col-start-2 xl:row-start-1 !p-5 sm:!p-6">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-accent-ink">
          Interests
        </p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {profile.interests.map((interest) => (
            <li key={interest} className="rounded-full border border-line bg-canvas px-3 py-1.5 text-xs font-medium leading-5 text-ink">
              {interest}
            </li>
          ))}
        </ul>
        <p className="mt-4 border-t border-line pt-4 text-sm leading-6 text-muted">
          {profile.aspiration}
        </p>
      </Panel>
    </div>
  )
}
