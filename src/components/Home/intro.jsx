import React from 'react'
import "./intro.css"
import { useTypewriter, Cursor} from 'react-simple-typewriter'
import {Link} from 'react-scroll'

const Intro = () => {
    const [text] = useTypewriter({
        words:['Software Engineer.', 'Data Engineer.', 'Web Developer.'],
        loop: {},
        typeSpeed: 120,
    })
    return (
    <section id="homepage">
        <div className="homepageContent">
            <div className="homeIntroduction">
                <span className="helloIntro">Hello,</span><br/>
                <span className="nameIntro">I'm <span className="name">Ha Thu</span></span>
            </div>
            <div className="homeIntroContent">
                Computer Science major and <span className="introContentJob">{text}</span>
                <span><Cursor cursorStyle="|" cursorBlinking={true} cursorColor='#61DAFB'/></span>
            </div>
            <Link>
                <div className="homeFindOutMoreBtn">
                    <a className='homeFindOutMoreBtnText'>Find Out More</a>
                </div>  
            </Link>
        </div>
    </section>
    )
}

export default Intro