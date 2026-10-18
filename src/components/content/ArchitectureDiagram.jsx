import { ArrowRight } from "lucide-react"
import { projects } from "../../data/portfolio"

const foroom = projects.find((project) => project.id === "foroom")

export default function ArchitectureDiagram() {
  return (
    <div className="w-full min-w-0 rounded-2xl border border-line bg-paper p-5 sm:p-6">
      <div className="mb-6 flex items-center justify-between gap-3">
        <h3 className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">FoROOM architecture</h3>
        <span aria-hidden="true" className="h-2 w-2 rounded-full bg-accent" />
      </div>
      <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 sm:gap-3" role="img" aria-label="FoROOM project architecture: React interface to Go API to MySQL">
        {foroom.architecture.map((part, index) => (
          <div className="contents" key={part}>
            <div className={`flex min-h-[74px] min-w-0 flex-col justify-between rounded-xl border p-2 sm:p-3 ${index === 1 ? "border-ink bg-ink text-paper" : "border-line bg-canvas text-ink"}`}>
              <span className="font-mono text-[9px] uppercase tracking-[0.14em] opacity-70">{index === 0 ? "01 / UI" : index === 1 ? "02 / API" : "03 / DATA"}</span>
              <span className="break-words text-sm font-bold leading-tight">{part}</span>
            </div>
            {index < foroom.architecture.length - 1 && <ArrowRight aria-hidden="true" className="h-4 w-4 text-muted" strokeWidth={1.75} />}
          </div>
        ))}
      </div>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
        <p className="text-xs leading-relaxed text-muted">JWT authentication · bcrypt</p>
        <a className="inline-flex min-h-11 items-center gap-2 rounded-lg px-2 text-sm font-bold text-ink underline decoration-accent decoration-2 underline-offset-4 transition-colors hover:text-accent-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent" href="#project-foroom">
          Explore FoROOM <span aria-hidden="true">↗</span>
        </a>
      </div>
    </div>
  )
}
