import { ArrowUpRight, Github, Linkedin, Mail } from "lucide-react"
import { ActionLink, Panel, SectionHeading } from "../components/ui"
import CopyEmailButton from "../components/content/CopyEmailButton"
import { profile } from "../data/portfolio"

const contacts = [
  {
    label: "LinkedIn",
    value: "linkedin.com/in/tran-ha-thu/",
    href: profile.linkedin,
    icon: Linkedin,
    description: "Professional profile",
  },
  {
    label: "GitHub",
    value: "github.com/oeggy03",
    href: profile.github,
    icon: Github,
    description: "Code and project repositories",
  },
]

export default function ContactView() {
  return (
    <div className="space-y-7">
      <SectionHeading
        eyebrow="Say hello"
        title="Contact"
        description="I’d love to hear from you. Email is the best way to reach me."
      />

      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <Panel className="flex flex-col justify-between">
          <div>
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-accent-ink">Email</p>
            <a className="mt-3 inline-flex min-h-11 items-center gap-2 break-all text-xl font-bold tracking-tight text-ink underline decoration-accent decoration-2 underline-offset-4 transition-colors hover:text-accent-ink sm:text-2xl focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent" href={`mailto:${profile.email}`}>
              <Mail aria-hidden="true" className="size-5 shrink-0" />{profile.email}
            </a>
            <p className="mt-3 max-w-md text-sm leading-6 text-muted">Use the link to start an email, or copy the address to your clipboard.</p>
          </div>
          <div className="mt-5 flex flex-wrap items-start gap-x-5 gap-y-1">
            <ActionLink href={`mailto:${profile.email}`}>Write an email</ActionLink>
            <CopyEmailButton />
          </div>
        </Panel>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          {contacts.map(({ label, value, href, icon: Icon, description }) => (
            <a key={label} href={href} target="_blank" rel="noreferrer noopener" className="group flex min-h-[112px] items-center gap-4 rounded-2xl border border-line bg-paper p-5 shadow-[0_8px_28px_rgba(23,33,36,0.035)] transition-colors hover:border-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:p-6">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-line bg-canvas text-ink">
                <Icon aria-hidden="true" className="size-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-muted">{label}</span>
                <span className="mt-1 block break-all text-sm font-bold text-ink">{value}</span>
                <span className="mt-1 block text-xs text-muted">{description}</span>
              </span>
              <ArrowUpRight aria-hidden="true" className="size-4 shrink-0 text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transform-none motion-reduce:transition-none" />
            </a>
          ))}
          <Panel className="flex min-h-[112px] items-center justify-between gap-4 !p-5 sm:!p-6">
            <div>
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-muted">Resume</p>
              <p className="mt-1 text-sm font-bold text-ink">Tran Ha Thu · PDF</p>
            </div>
            <ActionLink href={profile.resume} variant="secondary" target="_blank" rel="noreferrer" download>Open PDF</ActionLink>
          </Panel>
        </div>
      </div>
    </div>
  )
}
