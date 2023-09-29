import About from "./components/About/about"
import Intro from "./components/Home/intro"
import Navbar from "./components/NavBar/navbar"

function App() {
  return (
    <div className='App'>
      <Navbar/>
      <Intro/>
      <About/>
    </div>
  )
}

export default App
