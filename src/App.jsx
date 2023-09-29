import About from "./components/About/about"
import Experience from "./components/Experience/experience"
import Intro from "./components/Home/intro"
import Navbar from "./components/NavBar/navbar"

function App() {
  return (
    <div className='App'>
      <Navbar/>
      <Intro/>
      <About/>
      <Experience/>
    </div>
  )
}

export default App
