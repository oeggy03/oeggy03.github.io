import React, {useState} from 'react'
import './navbar.css'
import logo_nav from "../../assets/logo_navbar.png"
import linkedin from "../../assets/linkedin.png"
import github from "../../assets/github.png"
import burger from "../../assets/burgermenu.png"
import {Link} from 'react-scroll'
import Resume from "../../assets/Resume.pdf"

const Navbar = () => {
  const [showBurgerMenu, setShowBurgerMenu] = useState(false);

  return (
    <nav className='navbar'>
      <div className='internalLinks'>
        <Link to='homepage' activeClass="activeHome"spy={true} smooth={true}><img className="logo_nav" src={logo_nav} alt="Ha Thu" /></Link>
        <div className="allNavbarItems">
          <Link activeClass="active" to='aboutSection' spy={true} smooth={true} className="navbarItem">About</Link>
          <Link activeClass="active" to='experiencesSec' spy={true} smooth={true} className="navbarItem">Experience</Link>
          <Link activeClass="active" to='projectsSec' spy={true} smooth={true} className="navbarItem">Projects</Link>
          <Link activeClass="active" to='contactSec' spy={true} smooth={true} className="navbarItem">Contact</Link>
          <a href={Resume} target='_blank'className="navbarItem" download="Tran_Ha_Thu_Resume">Resume</a>
          
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
      <img className="burgerMenuImg" src={burger} alt="Menu" onClick={() => setShowBurgerMenu(!showBurgerMenu)}/>
      <div className="burgerNavMenu" style={{display: showBurgerMenu? 'flex' : 'none'}}>
        <div className="burgerMenuInternalLinks">
          <Link activeClass="active" to='aboutSection' spy={true} smooth={true} className="burgerMenuItem" onClick={() => setShowBurgerMenu(false)}>About</Link>
          <Link activeClass="active" to='experiencesSec' spy={true} smooth={true} className="burgerMenuItem" onClick={() => setShowBurgerMenu(false)}>Experience</Link>
          <Link activeClass="active" to='projectsSec' spy={true} smooth={true} className="burgerMenuItem" onClick={() => setShowBurgerMenu(false)}>Projects</Link>
          <Link activeClass="active" to='contactSec' spy={true} smooth={true} className="burgerMenuItem" onClick={() => setShowBurgerMenu(false)}>Contact</Link>
          <a href={Resume} target='_blank'className="burgerMenuItem" download="Tran_Ha_Thu_Resume">Resume</a>
        
        </div>
        <div className="externalLinks">
          <a href='https://www.linkedin.com/in/tran-ha-thu' target="_blank" rel="noreferrer noopener">
            <img className="linkedIn" src={linkedin} alt=""/>
          </a>
          <a href='https://github.com/oeggy03' target="_blank" rel="noreferrer noopener">
            <img className="github" src={github} alt=""/>
          </a>
        </div>
      </div>
      
    </nav>
  )
}

export default Navbar