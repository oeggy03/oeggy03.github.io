import React from 'react'
import './navbar.css'
import logo_nav from "../../assets/logo_navbar.png"
import linkedin from "../../assets/linkedin.png"
import github from "../../assets/github.png"
import {Link} from 'react-scroll'

const Navbar = () => {
  return (
    <nav className='navbar'>
      <div className='internalLinks'>
      <img className="logo_nav" src={logo_nav} alt="Ha Thu" />
        <div className="allNavbarItems">
          <Link className="navbarItem">About</Link>
          <Link className="navbarItem">Experience</Link>
          <Link className="navbarItem">Projects</Link>
          <Link className="navbarItem">Contact</Link>
          <Link className="navbarItem">Resume</Link>
        </div>
      </div>
      <div className="externalLinks">
        <a href='https://www.linkedin.com/in/tran-ha-thu' target="_blank" rel="noreferrer noopener">
          <img className="linkedIn" src={linkedin} alt=""/>
        </a>
        <a href='https://github.com/oeggy03' target="_blank" rel="noreferrer noopener">
          <img className="github" src={github} alt=""/>
        </a>
      </div>
      
    </nav>
  )
}

export default Navbar