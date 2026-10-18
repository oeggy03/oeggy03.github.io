import { Panel, SectionHeading } from "../components/ui"
import { projects, skillGroups, skills } from "../data/portfolio"

export default function SkillsView() {
  return (
    <div className="space-y-7">
      <SectionHeading
        eyebrow="Tools & languages"
        title="Skills"
        description="Go, Java and Python for backend development, complemented by relational databases, data analysis and web development."
      />

      <div className="grid items-start gap-4 lg:grid-cols-3">
        {skillGroups.map((group) => {
          const groupSkills = skills.filter((skill) => skill.group === group)
          return (
            <Panel key={group} className="!p-4 sm:!p-5">
              <h3 className="text-base font-bold tracking-tight text-ink">{group}</h3>
              <ul className="mt-2">
                {groupSkills.map((skill) => {
                  const primaryProjectId = skill.projectIds.includes("foroom") ? "foroom" : skill.projectIds[0]
                  const example = projects.find((project) => project.id === primaryProjectId)
                  return (
                    <li key={skill.id} className="flex min-h-11 items-center justify-between gap-2 border-t border-line first:border-0">
                      <span className="min-w-0 break-words text-sm font-semibold text-ink">{skill.name}</span>
                      {example && (
                        <a className="inline-flex min-h-11 shrink-0 items-center text-xs font-semibold text-muted underline decoration-line underline-offset-2 hover:text-ink hover:decoration-accent focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent" href={`#project-${example.id}`}>{example.title}</a>
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
