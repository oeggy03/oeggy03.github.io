import PropTypes from 'prop-types'
import {
  ExperienceView,
  OverviewView,
  ProjectsView,
  SkillsView,
} from './views/index.js'
import PortfolioShell from './components/layout/PortfolioShell.jsx'
import { profile } from './data/portfolio.js'
import { resolvePortfolioRoute } from './navigation/routes.js'

const sections = [
  { id: 'overview', label: 'Overview', content: <OverviewView /> },
  { id: 'projects', label: 'Projects', content: <ProjectsView /> },
  { id: 'experience', label: 'Experience', content: <ExperienceView /> },
  { id: 'skills', label: 'Skills', content: <SkillsView /> },
]

function App({ route = resolvePortfolioRoute('/') }) {
  return <PortfolioShell sections={sections} profile={profile} initialRoute={route} />
}

App.propTypes = {
  route: PropTypes.shape({
    fragment: PropTypes.string.isRequired,
    sectionId: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
  }),
}

export default App
