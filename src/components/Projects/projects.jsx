import React from 'react'
import "./projects.css"
import eggbot from "../../assets/proj_images/Eggbot_UI.png"
import port from "../../assets/proj_images/port_website.png"
import teleai from "../../assets/proj_images/teleai_proj.png"
import foroom from "../../assets/proj_images/foroom_proj.png"
import buddy4good from "../../assets/proj_images/buddy4good.png"
import foodhero from "../../assets/proj_images/foodhero.png"
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
import oop from "../../assets/oop.png"
import mss from "../../assets/mss.png"

const Projects = () => {
  return (
    <section id="projectsSec">
        <div className="projectsTitle">My Personal Projects</div>
        <div className="projCards">
            <div className="projCard">
            <img className="projUi" src={port} alt=""/>
                <div className="projCardContent">
                    <div className="expDescSec">
                        <div className="projTitle">This Portfolio Website!</div>
                        <div className="projDescription">A responsive and mobile-friendly website that tells you all about my work!</div>
                        <div className="projContent">
                            Built with <b>React</b> using the Vite build template, my portfolio website is a basic demonstration of my capabilities in Frontend Web Development.
                        </div>
                        <div className="projLinks">
                            <a href="https://github.com/oeggy03/oeggy03.github.io" className="linkTo" target="_blank" rel="noreferrer noopener">View the github page</a><br/>
                        </div>
                        <div className="projSkills">
                            <div className="skillsIntro">Skills:</div>
                            <a href='https://en.wikipedia.org/wiki/HTML' target="_blank" rel="noreferrer noopener"><img className="techStackIconProj html" src={html} alt=""/></a>
                            <a href='https://en.wikipedia.org/wiki/CSS' target="_blank" rel="noreferrer noopener"><img className="techStackIconProj css" src={css} alt=""/></a>
                            <a href='https://en.wikipedia.org/wiki/JavaScript' target="_blank" rel="noreferrer noopener"><img className="techStackIconProj js" src={js} alt=""/></a>
                            <a href='https://en.wikipedia.org/wiki/React_(software)' target="_blank" rel="noreferrer noopener"><img className="techStackIconProj react" src={react} alt=""/></a>
                            <a href='https://en.wikipedia.org/wiki/Git' target="_blank" rel="noreferrer noopener"><img className="techStackIconProj git" src={git} alt=""/></a>
                            <a href='https://en.wikipedia.org/wiki/Object-oriented_programming' target="_blank" rel="noreferrer noopener"><img className="techStackIconProj oop" src={oop} alt=""/></a>
                        </div>

                    </div>
                </div>
            </div>
            <div className="projCard">
                <img className="projUi" src={eggbot} alt=""/>
                <div className="projCardContent">
                    <div className="expDescSec">
                        <div className="projTitle">Eggbot</div>
                        <div className="projDescription">A task-tracking chatbot with an interactive GUI.</div>
                        <div className="projContent">
                            Eggbot is a chatbot created to help me manage my tasks. It is built with <b>Java</b> and <b>JavaFX</b>, and the code follows the <b>Object-Oriented Programming</b> paradigm very closely.
                        </div>
                        <div className="projLinks">
                            <a href="https://github.com/oeggy03/ip/releases/tag/A-Release" className="linkTo" target="_blank" rel="noreferrer noopener">Try out Eggbot!</a><br/>
                            <a href="https://oeggy03.github.io/ip/" className="linkTo" target="_blank" rel="noreferrer noopener">Learn more about Eggbot</a><br/>
                            <a href="https://github.com/oeggy03/ip" className="linkTo" target="_blank" rel="noreferrer noopener">View Eggbot's github page</a><br/>
                        </div>
                        <div className="projSkills">
                            <div className="skillsIntro">Skills:</div>
                            <a href='https://en.wikipedia.org/wiki/Java_(programming_language)' target="_blank" rel="noreferrer noopener"><img className="techStackIconProj java" src={java} alt=""/></a>
                            <a href='https://en.wikipedia.org/wiki/Git' target="_blank" rel="noreferrer noopener"><img className="techStackIconProj git" src={git} alt=""/></a>
                            <a href='https://en.wikipedia.org/wiki/Object-oriented_programming' target="_blank" rel="noreferrer noopener"><img className="techStackIconProj oop" src={oop} alt=""/></a>
                        </div>

                    </div>
                </div>
            </div>
            <div className="projCard">
                <img className="projUi" src={teleai} alt=""/>
                <div className="projCardContent">
                    <div className="expDescSec">
                        <div className="projTitle">TeleAI</div>
                        <div className="projDescription">A Telegram bot, capable of recognising select objects in photos sent to it.</div>
                        <div className="projContent">
                            This bot has been trained using <b>OpenCV</b>, <b>Tensorflow</b> and the keras deep learning API, using the CIFAR10 dataset. It was programmed using <b>Python</b>.
                            It is capable of identifying cats, dogs, planes and more!
                        </div>
                        <div className="projLinks">
                            <a href="https://oeggy03.github.io/TeleAI/" className="linkTo" target="_blank" rel="noreferrer noopener">Learn more about TeleAI</a><br/>
                            <a href="https://github.com/oeggy03/TeleAI" className="linkTo" target="_blank" rel="noreferrer noopener">View TeleAI's github page</a><br/>
                        </div>
                        <div className="projSkills">
                            <div className="skillsIntro">Skills:</div>
                            <a href='https://en.wikipedia.org/wiki/Python_(programming_language)' target="_blank" rel="noreferrer noopener"><img className="techStackIconProj python" src={python} alt=""/></a>
                        </div>

                    </div>
                </div>
            </div>
            <div className="projCard">
                <img className="projUi" src={foroom} alt=""/>
                <div className="projCardContent">
                    <div className="expDescSec">
                        <div className="projTitle">FoROOM</div>
                        <div className="projDescription">A minimalistic forum that facilitates discussion between people with different interests and of different backgrounds.</div>
                        <div className="projContent">
                            This project incorporates both a front-end built with <b>React</b>, and a back-end built with <b>GO</b> and <b>MySQL</b>. It supports secure user authentication using jwt tokens and bcrypt.
                        </div>
                        <div className="projLinks">
                            <a href="https://devpost.com/software/foroom" className="linkTo" target="_blank" rel="noreferrer noopener">Learn more on DevPost</a><br/>
                            <a href="https://github.com/oeggy03/cvwo-frontend" className="linkTo" target="_blank" rel="noreferrer noopener">View the front-end's Github</a><br/>
                            <a href="https://github.com/oeggy03/cvwo-backend" className="linkTo" target="_blank" rel="noreferrer noopener">View the back-end's Github</a><br/>
                        </div>
                        <div className="projSkills">
                            <div className="skillsIntro">Skills:</div>
                            <a href='https://en.wikipedia.org/wiki/HTML' target="_blank" rel="noreferrer noopener"><img className="techStackIconProj html" src={html} alt=""/></a>
                            <a href='https://en.wikipedia.org/wiki/CSS' target="_blank" rel="noreferrer noopener"><img className="techStackIconProj css" src={css} alt=""/></a>
                            <a href='https://en.wikipedia.org/wiki/JavaScript' target="_blank" rel="noreferrer noopener"><img className="techStackIconProj js" src={js} alt=""/></a>
                            <a href='https://en.wikipedia.org/wiki/React_(software)' target="_blank" rel="noreferrer noopener"><img className="techStackIconProj react" src={react} alt=""/></a>
                            <a href='https://en.wikipedia.org/wiki/Go_(programming_language)' target="_blank" rel="noreferrer noopener"><img className="techStackIconProj go" src={go} alt=""/></a>
                            <a href='https://en.wikipedia.org/wiki/MySQL' target="_blank" rel="noreferrer noopener"><img className="techStackIconProj mysql" src={mysql} alt=""/></a>
                        </div>

                    </div>
                </div>
            </div>
            <div className="projCard">
                <img className="projUi" src={buddy4good} alt=""/>
                <div className="projCardContent">
                    <div className="expDescSec">
                        <div className="projTitle">Buddy4Good</div>
                        <div className="projDescription"> A platform that encourages the buddying up of able-bodied people with disabled people to spend time doing activities together. </div>
                        <div className="projContent">
                            Originally built for the Hack For Good 2023 hackathon for SGEnable, this project incorporates both a front-end built with <b>React</b>, and a back-end built with <b>GO</b> and <b>MySQL</b>. It supports secure user authentication using jwt tokens and bcrypt.
                        </div>
                        <div className="projLinks">
                            <a href="https://oeggy03.github.io/h4g-frontend/" className="linkTo" target="_blank" rel="noreferrer noopener">Learn more on Github pages</a><br/>
                            <a href="https://devpost.com/software/buddy4good" className="linkTo" target="_blank" rel="noreferrer noopener">Learn more on DevPost</a><br/>
                            <a href="https://github.com/oeggy03/h4g-frontend" className="linkTo" target="_blank" rel="noreferrer noopener">View the front-end's Github</a><br/>
                            <a href="https://github.com/oeggy03/h4g-backend" className="linkTo" target="_blank" rel="noreferrer noopener">View the back-end's Github</a><br/>
                        </div>
                        <div className="projSkills">
                            <div className="skillsIntro">Skills:</div>
                            <a href='https://en.wikipedia.org/wiki/Git' target="_blank" rel="noreferrer noopener"><img className="techStackIconProj git" src={git} alt=""/></a>
                            <a href='https://en.wikipedia.org/wiki/HTML' target="_blank" rel="noreferrer noopener"><img className="techStackIconProj html" src={html} alt=""/></a>
                            <a href='https://en.wikipedia.org/wiki/CSS' target="_blank" rel="noreferrer noopener"><img className="techStackIconProj css" src={css} alt=""/></a>
                            <a href='https://en.wikipedia.org/wiki/JavaScript' target="_blank" rel="noreferrer noopener"><img className="techStackIconProj js" src={js} alt=""/></a>
                            <a href='https://en.wikipedia.org/wiki/React_(software)' target="_blank" rel="noreferrer noopener"><img className="techStackIconProj react" src={react} alt=""/></a>
                            <a href='https://en.wikipedia.org/wiki/Go_(programming_language)' target="_blank" rel="noreferrer noopener"><img className="techStackIconProj go" src={go} alt=""/></a>
                            <a href='https://en.wikipedia.org/wiki/MySQL' target="_blank" rel="noreferrer noopener"><img className="techStackIconProj mysql" src={mysql} alt=""/></a>
                        </div>

                    </div>
                </div>
            </div>
            <div className="projCard">
                <img className="projUi" src={foodhero} alt=""/>
                <div className="projCardContent">
                    <div className="expDescSec">
                        <div className="projTitle">FoodHero</div>
                        <div className="projDescription"> A telegram bot that allows users to share their leftover food by posting it into the bot's database, and for users who would like the leftovers to retrieve it later on. </div>
                        <div className="projContent">
                            Originally built in 24 hours for the LifeHack 2022 hackathon, this project is built with <b>Python</b>, and communicates with the relational database <b>SQLlite</b>.
                        </div>
                        <div className="projLinks">
                            <a href="https://oeggy03.github.io/FoodHeroBot/" className="linkTo" target="_blank" rel="noreferrer noopener">Learn more on Github pages</a><br/>
                            <a href="https://devpost.com/software/kalilinux" className="linkTo" target="_blank" rel="noreferrer noopener">Learn more on DevPost</a><br/>
                            <a href="https://github.com/oeggy03/FoodHeroBot" className="linkTo" target="_blank" rel="noreferrer noopener">View the Github repository</a><br/>
                        </div>
                        <div className="projSkills">
                            <div className="skillsIntro">Skills:</div>
                            <a href='https://en.wikipedia.org/wiki/Python_(programming_language)' target="_blank" rel="noreferrer noopener"><img className="techStackIconProj python" src={python} alt=""/></a>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </section>
  )
}

export default Projects