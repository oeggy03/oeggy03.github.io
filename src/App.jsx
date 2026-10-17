import {
  AboutView,
  ContactView,
  ExperienceView,
  OverviewView,
  ProjectsView,
  SkillsView,
} from './views/index.js'
import PortfolioShell from './components/layout/PortfolioShell.jsx'
import { profile } from './data/portfolio.js'

const sections = [
  { id: 'overview', label: 'Overview', content: <OverviewView /> },
  { id: 'projects', label: 'Projects', content: <ProjectsView /> },
  { id: 'experience', label: 'Experience', content: <ExperienceView /> },
  { id: 'skills', label: 'Skills', content: <SkillsView /> },
  { id: 'about', label: 'About', content: <AboutView /> },
  { id: 'contact', label: 'Contact', content: <ContactView /> },
]

function App() {
  return <PortfolioShell sections={sections} profile={profile} />
}

export default App
