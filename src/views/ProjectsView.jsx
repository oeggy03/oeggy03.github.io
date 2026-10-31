import { useState } from 'react'
import { projects } from '../data/portfolio.js'
import { usePortfolioNavigation } from '../navigation/NavigationContext.jsx'
import ProjectCaseStudy from '../components/content/ProjectCaseStudy.jsx'
import ProjectExplorer from '../components/content/ProjectExplorer.jsx'
import ProjectIndex from '../components/content/ProjectIndex.jsx'
import { resolvePortfolioRoute } from '../navigation/routes.js'

export default function ProjectsView() {
  const { fragment } = usePortfolioNavigation()
  const [activeCategory, setActiveCategory] = useState('All')
  const route = resolvePortfolioRoute(fragment)
  const selectedProject = projects.find(({ id }) => route.projectId === id)

  if (selectedProject?.caseStudy && route.projectView === 'info') return <ProjectCaseStudy project={selectedProject} />
  if (selectedProject) return <ProjectExplorer />

  return <ProjectIndex activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
}
