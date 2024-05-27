import React, { useState } from 'react'
import './navbar.css'
import logo_nav from "../../assets/logo_navbar.png"
import linkedin from "../../assets/linkedin.png"
import github from "../../assets/github.png"
import burger from "../../assets/burgermenu.png"
import { Link } from 'react-scroll'
import Resume from "../../assets/Resume_TranHaThu.pdf"

const Navbar = () => {
  const [burger_class, setBurgerClass] = useState("burger-bar unclicked");
  const [menu_class, setMenuClass] = useState("burgerNavMenu hidden");
  const [isMenuClicked, setIsMenuClicked] = useState(false);

  const updateBurgerMenu = () => {
    if (!isMenuClicked) {
      setBurgerClass("burger-bar clicked")
      setMenuClass("burgerNavMenu visible")
    } else {
      setBurgerClass("burger-bar unclicked")
      setMenuClass("burgerNavMenu hidden")
    }

    setIsMenuClicked(!isMenuClicked)
  }

  return (
    <nav className='navbar'>
      <div className='internalLinks'>
        <Link to='homepage' activeClass="activeHome" spy={true} smooth={true}><img className="logo_nav" src={logo_nav} alt="Ha Thu" /></Link>
        <div className="allNavbarItems">
          <Link activeClass="active" to='aboutSection' spy={true} smooth={true} className="navbarItem">About</Link>
          <Link activeClass="active" to='experiencesSec' spy={true} smooth={true} className="navbarItem">Experience</Link>
          <Link activeClass="active" to='projectsSec' spy={true} smooth={true} className="navbarItem">Projects</Link>
          <Link activeClass="active" to='contactSec' spy={true} smooth={true} className="navbarItem">Contact</Link>
          <a href={Resume} target='_blank' className="burgerMenuItem">Resume</a>

        </div>
      </div>
      <div className="externalLinks">
        <a href='https://www.linkedin.com/in/tran-ha-thu' target="_blank" rel="noreferrer noopener">
          <img className="linkedIn" src={linkedin} alt="" />
        </a>
        <a href='https://github.com/oeggy03' target="_blank" rel="noreferrer noopener">
          <img className="github" src={github} alt="" />
        </a>
      </div>

      <div className="burger-menu" onClick={updateBurgerMenu}>
        <div className={burger_class} ></div>
        <div className={burger_class} ></div>
        <div className={burger_class} ></div>
      </div>

      <div className={menu_class}>
        <Link activeClass="active" to='aboutSection' spy={true} smooth={true} className="burgerMenuItem" onClick={updateBurgerMenu}>About</Link>
        <Link activeClass="active" to='experiencesSec' spy={true} smooth={true} className="burgerMenuItem" onClick={updateBurgerMenu}>Experience</Link>
        <Link activeClass="active" to='projectsSec' spy={true} smooth={true} className="burgerMenuItem" onClick={updateBurgerMenu}>Projects</Link>
        <Link activeClass="active" to='contactSec' spy={true} smooth={true} className="burgerMenuItem" onClick={updateBurgerMenu}>Contact</Link>
        <a href={Resume} target='_blank' className="burgerMenuItem">Resume</a>
      </div>
    </nav>
  )
}

export default Navbar