import { SectionHeading } from "../components/ui"
import ProjectExplorer from "../components/content/ProjectExplorer"

export default function ProjectsView() {
  return (
    <div className="space-y-7">
      <SectionHeading
        eyebrow="Selected work"
        title="Projects"
        description="Backend applications, data tools and automation, with source code and technical details."
      />
      <ProjectExplorer />
    </div>
  )
}
