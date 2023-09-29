import About from "./components/About/about"
import Contact from "./components/Contact/contact"
import Experience from "./components/Experience/experience"
import Intro from "./components/Home/intro"
import Navbar from "./components/NavBar/navbar"
import Projects from "./components/Projects/projects"

function App() {
  return (
    <div className='App'>
      <Navbar/>
      <Intro/>
      <About/>
      <Experience/>
      <Projects/>
      <Contact/>
    </div>
  )
}

export default App
