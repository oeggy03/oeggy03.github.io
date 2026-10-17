import { SectionHeading } from "../components/ui"
import ProjectExplorer from "../components/content/ProjectExplorer"

export default function ProjectsView() {
  return (
    <div className="space-y-7">
      <SectionHeading
        eyebrow="Selected work"
        title="Projects"
        description="A mix of backend systems, small bots and interface work. Select a category or project to explore the details."
      />
      <ProjectExplorer />
    </div>
  )
}
