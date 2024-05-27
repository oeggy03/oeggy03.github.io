import React from 'react'
import "./experience.css"
import hdb from "../../assets/hdb.png"
import cfw from "../../assets/cfw.png"
import nus from "../../assets/NUS.png"
import eastspring from "../../assets/eastspring.png"
import astar from "../../assets/astar.png"
import git from "../../assets/git.png"
import js from "../../assets/js.png"
import mss from "../../assets/mss.png"
import oop from "../../assets/oop.png"
import python from "../../assets/python.png"
import react from "../../assets/react.png"
import css from "../../assets/css.png"
import html from "../../assets/html.png"

const Experience = () => {
    return (
    <section id="experiencesSec">
        <h2 className="experienceTitle">Work Experience</h2>
        <div className="expCards">
            <div className="expCard">
                <div className="cardContent">
                    <a href='https://www.hdb.gov.sg/cs/infoweb/homepage' target="_blank" rel="noreferrer noopener"><img className="companyIcon" src={hdb} alt=""/></a>
                    <div className="expDescSec">
                        <div className="expTitle">Data Analysis / Machine Learning Intern</div>
                        <div className="expCompany">Housing Development Board (HDB)</div>
                        <div className="expDates">May 2024 - Present</div>
                        <div className="expDescription">Utilized machine learning, data analysis and software engineering to drive business processes in HDB.</div>
                        <div className="expSkills">
                            <div className="skillsIntro">Skills:</div>
                            <a href='https://en.wikipedia.org/wiki/Python_(programming_language)' target="_blank" rel="noreferrer noopener"><img className="techStackIconExp python" src={python} alt=""/></a>
                        </div>

                    </div>
                </div>
            </div>
            <div className="expCard">
                <div className="cardContent">
                    <a href='https://www.care4we.com/' target="_blank" rel="noreferrer noopener"><img className="companyIcon" src={cfw} alt=""/></a>
                    <div className="expDescSec">
                        <div className="expTitle">Tech Lead</div>
                        <div className="expCompany">CareForWe (Healthtech startup) </div>
                        <div className="expDates">Dec 2023 - Present</div>
                        <div className="expDescription">Headed development of a video hosting and front facing business website.</div>
                        <div className="expSkills">
                            <div className="skillsIntro">Skills:</div>
                            <a href='https://en.wikipedia.org/wiki/JavaScript' target="_blank" rel="noreferrer noopener"><img className="techStackIconExp js" src={js} alt=""/></a>
                            <a href='https://en.wikipedia.org/wiki/React_(software)' target="_blank" rel="noreferrer noopener"><img className="techStackIconExp react" src={react} alt=""/></a>
                            <a href='https://en.wikipedia.org/wiki/HTML' target="_blank" rel="noreferrer noopener"><img className="techStackIconExp html" src={html} alt=""/></a>
                            <a href='https://en.wikipedia.org/wiki/CSS' target="_blank" rel="noreferrer noopener"><img className="techStackIconExp css" src={css} alt=""/></a>
                        </div>

                    </div>
                </div>
            </div>
            <div className="expCard">
                <div className="cardContent">
                    <a href='https://nus.edu.sg/' target="_blank" rel="noreferrer noopener"><img className="companyIcon" src={nus} alt=""/></a>
                    <div className="expDescSec">
                        <div className="expTitle">Teaching Assistant</div>
                        <div className="expCompany">National University of Singapore</div>
                        <div className="expDates">Aug 2023 - Present</div>
                        <div className="expDescription">Graded programming assignments and taught programming methodology concepts to students.</div>
                        <div className="expSkills">
                            <div className="skillsIntro">Skills:</div>
                            <a href='https://en.wikipedia.org/wiki/JavaScript' target="_blank" rel="noreferrer noopener"><img className="techStackIconExp js" src={js} alt=""/></a>
                        </div>

                    </div>
                </div>
            </div>
            <div className="expCard">
                <div className="cardContent">
                    <a href='https://www.eastspring.com/sg' target="_blank" rel="noreferrer noopener"><img className="companyIcon" src={eastspring} alt=""/></a>
                    <div className="expDescSec">
                        <div className="expTitle">Data Engineering Intern</div>
                        <div className="expCompany">Eastspring Investments Singapore</div>
                        <div className="expDates">May 2023 - Aug 2023</div>
                        <div className="expDescription">Handled large datasets with Python and Pandas, and wrote structured Object-Oriented Programming code to aid in daily operations.</div>
                        <div className="expSkills">
                            <div className="skillsIntro">Skills:</div>
                            <a href='https://en.wikipedia.org/wiki/Git' target="_blank" rel="noreferrer noopener"><img className="techStackIconExp git" src={git} alt=""/></a>
                            <a href='https://en.wikipedia.org/wiki/Python_(programming_language)' target="_blank" rel="noreferrer noopener"><img className="techStackIconExp python" src={python} alt=""/></a>
                            <a href='https://en.wikipedia.org/wiki/Object-oriented_programming' target="_blank" rel="noreferrer noopener"><img className="techStackIconExp oop" src={oop} alt=""/></a>
                            <a href='https://en.wikipedia.org/wiki/Microsoft_SQL_Server' target="_blank" rel="noreferrer noopener"><img className="techStackIconExp mss" src={mss} alt=""/></a>
                        </div>
                    </div>
                </div>
            </div>
            <div className="expCard">
                <div className="cardContent">
                    <a href='https://www.a-star.edu.sg/' target="_blank" rel="noreferrer noopener"><img className="companyIcon astar" src={astar} alt=""/></a>
                    <div className="expDescSec">
                        <div className="expTitle">Intern</div>
                        <div className="expCompany">A*STAR - Agency for Science, Technology and Research</div>
                        <div className="expDates">Dec 2019 - Jan 2020</div>
                        <div className="expDescription">Trained an Robotic Arm with AI and Image Recognition capabilities using Python and OpenCV.</div>
                        <div className="expSkills">
                            <div className="skillsIntro">Skills:</div>
                            <a href='https://en.wikipedia.org/wiki/Python_(programming_language)' target="_blank" rel="noreferrer noopener"><img className="techStackIconExp python" src={python} alt=""/></a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    )
}

export default Experience