import { ArrowUpRight } from "lucide-react"
import { ActionLink, Badge, Panel, SectionHeading } from "../components/ui"
import { profile } from "../data/portfolio"
import nusLogo from "../assets/NUS.png"

export default function AboutView() {
  return (
    <div className="space-y-7">
      <SectionHeading
        eyebrow="A little context"
        title="About"
        description="My interests sit where practical software, data and thoughtful problem solving meet."
      />

      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <Panel className="flex flex-col justify-between">
          <div>
            <p className="text-lg leading-8 text-ink">My academic background at the National University of Singapore combines Computer Science with minors in Quantitative Finance and Management. I’m drawn to software engineering, quantitative finance and trading, and artificial intelligence.</p>
            <p className="mt-5 text-base leading-7 text-muted">{profile.aspiration}</p>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {profile.interests.map((interest) => <Badge key={interest} tone="sage">{interest}</Badge>)}
          </div>
        </Panel>

        <Panel className="flex flex-col">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-accent-ink">Education</p>
          <a className="mt-4 flex items-start gap-4 rounded-xl border border-line bg-canvas p-4 transition-colors hover:border-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent" href={profile.education.url} target="_blank" rel="noreferrer noopener">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-lg border border-line bg-paper p-2">
              <img className="max-h-full max-w-full object-contain" src={nusLogo} alt="" width="80" height="80" loading="lazy" decoding="async" />
            </div>
            <div>
              <h3 className="text-base font-bold text-ink">{profile.education.institution}</h3>
              <p className="mt-1 text-sm text-muted">{profile.education.programme}</p>
              <p className="mt-2 text-xs leading-relaxed text-muted">Minors: {profile.education.minors.join(" · ")}</p>
            </div>
            <ArrowUpRight aria-hidden="true" className="ml-auto size-4 shrink-0 text-muted" />
          </a>
          <div className="mt-auto flex flex-wrap gap-3 pt-6">
            <ActionLink href={profile.resume} variant="secondary" target="_blank" rel="noreferrer">View resume</ActionLink>
            <ActionLink href="#contact" variant="subtle">Contact me</ActionLink>
          </div>
        </Panel>
      </div>
    </div>
  )
}
