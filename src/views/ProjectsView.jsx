import { useState } from 'react'
import { projects } from '../data/portfolio.js'
import { usePortfolioNavigation } from '../navigation/NavigationContext.jsx'
import ProjectCaseStudy from '../components/content/ProjectCaseStudy.jsx'
import ProjectExplorer from '../components/content/ProjectExplorer.jsx'
import ProjectIndex from '../components/content/ProjectIndex.jsx'

export default function ProjectsView() {
  const { fragment } = usePortfolioNavigation()
  const [activeCategory, setActiveCategory] = useState('All')
  const selectedProject = projects.find(({ id }) => fragment === `project-${id}`)

  if (selectedProject?.caseStudy) return <ProjectCaseStudy project={selectedProject} />
  if (selectedProject) return <ProjectExplorer />

  return <ProjectIndex activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
}
