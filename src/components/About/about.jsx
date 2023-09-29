import React from 'react'
import "./about.css"
import git from "../../assets/git.png"
import css from "../../assets/css.png"
import go from "../../assets/golang.png"
import html from "../../assets/html.png"
import java from "../../assets/java.png"
import js from "../../assets/js.png"
import mysql from "../../assets/mysql.png"
import postgre from "../../assets/postgre.png"
import python from "../../assets/python.png"
import react from "../../assets/react.png"
import expressjs from "../../assets/expressjs.png"

const About = () => {
    let descString = `
    

    Aside from majoring in Computer Science, I am also minoring in Quantitative Finance and Management.
    ` 
    return (
        <section id="aboutSection">
            <div className="aboutMe">
                <div className="aboutMeTitle">About Me</div>
                <div className="aboutMeDesc aboutMeDesc1">Hello! I'm a <b>Computer Science</b> sophomore at the <b>National University of Singapore (NUS)</b> who also minors in Quantitative Finance and Management.</div>
                <br/>
                <div className="aboutMeDesc aboutMeDesc2"> 
                    Deeply passionate about the fields of Software Engineering, Quantitative Finance/Trading, and Artificial Intelligence, 
                    my goal is to lead the next generation of programmers and make our world a better place through technology and innovation.
                </div>
            </div>
            <div className="techStacks">
                <span className="techStackIntro">I am proficient in:</span>
                <div className="techStackIcons">
                    <a href='https://en.wikipedia.org/wiki/Git' target="_blank" rel="noreferrer noopener"><img className="techStackIcon git" src={git} alt=""/></a>
                    <a href='https://en.wikipedia.org/wiki/HTML' target="_blank" rel="noreferrer noopener"><img className="techStackIcon html" src={html} alt=""/></a>
                    <a href='https://en.wikipedia.org/wiki/CSS' target="_blank" rel="noreferrer noopener"><img className="techStackIcon css" src={css} alt=""/></a>
                    <a href='https://en.wikipedia.org/wiki/JavaScript' target="_blank" rel="noreferrer noopener"><img className="techStackIcon js" src={js} alt=""/></a>
                    <a href='https://en.wikipedia.org/wiki/React_(software)' target="_blank" rel="noreferrer noopener"><img className="techStackIcon react" src={react} alt=""/></a>
                    <a href='https://en.wikipedia.org/wiki/Go_(programming_language)' target="_blank" rel="noreferrer noopener"><img className="techStackIcon go" src={go} alt=""/></a>
                    <a href='https://en.wikipedia.org/wiki/Express.js' target="_blank" rel="noreferrer noopener"><img className="techStackIcon expressjs" src={expressjs} alt=""/></a>
                    <a href='https://en.wikipedia.org/wiki/MySQL' target="_blank" rel="noreferrer noopener"><img className="techStackIcon mysql" src={mysql} alt=""/></a>
                    <a href='https://en.wikipedia.org/wiki/PostgreSQL' target="_blank" rel="noreferrer noopener"><img className="techStackIcon postgre" src={postgre} alt=""/></a>
                    <a href='https://en.wikipedia.org/wiki/Java_(programming_language)' target="_blank" rel="noreferrer noopener"><img className="techStackIcon java" src={java} alt=""/></a>
                    <a href='https://en.wikipedia.org/wiki/Python_(programming_language)' target="_blank" rel="noreferrer noopener"><img className="techStackIcon python" src={python} alt=""/></a>
                </div>
            </div>
        </section>
    )
}

export default About