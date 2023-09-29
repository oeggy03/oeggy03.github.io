import React from 'react'
import "./contact.css"

const Contact = () => {
  return (
    <section id="contactSec">
        <div className="contactsTitle">Contact Me</div>
        <div className="contactDesc">I would love to hear from you!</div>
        <div className="contactLinks">
          <div className="contactCard">
            <div className="contactText">Email: tranhathu@u.nus.edu</div>
          </div>
          <div className="contactCard">
            <div className="contactText">LinkedIn: <a href="https://www.linkedin.com/in/tran-ha-thu/" className="linkedinlink">https://www.linkedin.com/in/tran-ha-thu/</a></div>
          </div>
        </div>
    </section>
  )
}

export default Contact
