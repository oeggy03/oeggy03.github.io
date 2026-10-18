import { ArrowDown, ArrowUpRight } from "lucide-react"
import { ActionLink, Badge, Panel } from "../components/ui"
import ArchitectureDiagram from "../components/content/ArchitectureDiagram"
import { experiences, projects } from "../data/portfolio"

const featuredProject = projects.find((project) => project.id === "foroom")
const currentExperience = experiences[0]

export default function OverviewView() {
  return (
    <div className="space-y-10 sm:space-y-12">
      <section className="grid min-w-0 gap-7 lg:grid-cols-[1.12fr_0.88fr] lg:items-center lg:gap-10">
        <div className="min-w-0">
          <p className="mb-4 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-ink">Backend / Software Engineering</p>
          <h2 className="max-w-2xl break-words text-4xl font-bold leading-[1.1] tracking-[-0.05em] text-ink sm:text-5xl lg:text-5xl">Backend engineering.<br className="hidden sm:block" /> Practical solutions.</h2>
          <p className="mt-5 max-w-xl text-base leading-7 text-muted sm:text-lg">
            I&apos;m Tran Ha Thu, a software engineer focused on backend development. I build applications with Go, Java and Python, with experience in data engineering and machine learning.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <ActionLink href="#projects">View projects</ActionLink>
            <ActionLink href="#contact" variant="secondary">Get in touch</ActionLink>
          </div>
        </div>
        <ArchitectureDiagram />
      </section>

      <section aria-label="Areas of work" className="grid gap-4 border-y border-line py-5 sm:grid-cols-3 sm:gap-6">
        <div>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">01 / Backend systems</p>
          <p className="mt-2 text-sm font-semibold text-ink">Go · Java · Python</p>
        </div>
        <div>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">02 / Data &amp; AI</p>
          <p className="mt-2 text-sm font-semibold text-ink">SQL · Pandas · OpenCV</p>
        </div>
        <div>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">03 / Product engineering</p>
          <p className="mt-2 text-sm font-semibold text-ink">React · Express.js</p>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[minmax(0,1.45fr)_minmax(245px,0.55fr)] lg:items-stretch">
        <Panel className="!p-0">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4 sm:px-6">
            <div>
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-accent-ink">Featured work</p>
              <h3 className="mt-1 text-xl font-bold tracking-tight text-ink">{featuredProject.title}</h3>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">Forum · Full stack</span>
          </div>
          <div className="grid sm:grid-cols-[0.9fr_1.1fr]">
            <div className="flex h-48 items-center justify-center overflow-hidden border-b border-line bg-canvas p-3 sm:h-full sm:min-h-[230px] sm:border-b-0 sm:border-r">
              <img className="h-full w-full object-contain" src={featuredProject.image} alt={featuredProject.imageAlt} width={featuredProject.imageWidth} height={featuredProject.imageHeight} loading="eager" decoding="async" />
            </div>
            <div className="p-5 sm:p-6">
              <p className="text-sm leading-6 text-muted">A discussion forum with a Go backend, MySQL storage and JWT authentication.</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {["Go", "MySQL", "JWT", "bcrypt"].map((skill) => <Badge key={skill} tone="sage">{skill}</Badge>)}
              </div>
              <a href="#project-foroom" className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-ink underline decoration-accent decoration-2 underline-offset-4 transition-colors hover:text-accent-ink focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
                Explore FoROOM <ArrowUpRight aria-hidden="true" className="size-4" />
              </a>
            </div>
          </div>
        </Panel>

        <Panel className="flex flex-col justify-between">
          <div>
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-accent-ink">Experience</p>
            <h3 className="mt-2 text-xl font-bold tracking-tight text-ink">{currentExperience.role}</h3>
            <p className="mt-1 text-sm font-semibold text-ink">{currentExperience.company}</p>
            <p className="mt-1 font-mono text-xs text-muted">{currentExperience.dates}</p>
            <p className="mt-4 text-sm leading-6 text-muted">{currentExperience.summary}</p>
          </div>
          <a href="#experience" className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-ink underline decoration-accent decoration-2 underline-offset-4 transition-colors hover:text-accent-ink focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
            All experience <ArrowDown aria-hidden="true" className="size-4" />
          </a>
        </Panel>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
        <a href="#about" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-ink underline decoration-line underline-offset-4 hover:decoration-accent focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
          A little more about me <span aria-hidden="true">&#8599;</span>
        </a>
      </div>
    </div>
  )
}
