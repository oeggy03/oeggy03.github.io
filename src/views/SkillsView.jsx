import { Panel, SectionHeading } from "../components/ui"
import { projects, skillGroups, skills } from "../data/portfolio"

export default function SkillsView() {
  return (
    <div className="space-y-7">
      <SectionHeading
        eyebrow="Tools & languages"
        title="Skills"
        description="A working set built through projects, internships and teaching. Project examples are shown where available."
      />

      <div className="grid gap-4 lg:grid-cols-3">
        {skillGroups.map((group) => {
          const groupSkills = skills.filter((skill) => skill.group === group)
          return (
            <Panel key={group} className="!p-5 sm:!p-6">
              <h3 className="text-lg font-bold tracking-tight text-ink">{group}</h3>
              <ul className="mt-4 space-y-3">
                {groupSkills.map((skill) => {
                  const examples = skill.projectIds.map((id) => projects.find((project) => project.id === id)).filter(Boolean)
                  return (
                    <li key={skill.id} className="border-t border-line pt-3 first:border-0 first:pt-0">
                      <span className="inline-flex min-h-8 items-center rounded-lg border border-line bg-canvas px-3 py-1 text-sm font-semibold text-ink">{skill.name}</span>
                      {examples.length > 0 && (
                        <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted">
                          <span>In</span>
                          {examples.map((project, index) => (
                            <span key={project.id}>
                              {index > 0 && <span aria-hidden="true"> · </span>}
                              <a className="font-semibold text-ink underline decoration-line underline-offset-2 hover:decoration-accent focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent" href={`#project-${project.id}`}>{project.title}</a>
                            </span>
                          ))}
                        </div>
                      )}
                    </li>
                  )
                })}
              </ul>
            </Panel>
          )
        })}
      </div>
    </div>
  )
}
