import { useState } from 'react'
import { portfolio } from '../data/portfolio'

function Contact() {
  const [message, setMessage] = useState('')
  const [showHelp, setShowHelp] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(event) {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <main className="page-content">
      <section className="section contact-section" aria-labelledby="contact-heading">
        <p className="eyebrow">Get in Touch</p>
        <h1 id="contact-heading" className="page-title">Contact Me</h1>
        <p>Have a question or want to collaborate? Send me a message.</p>
        <form className="contact-form" onSubmit={handleSubmit}>
          <label htmlFor="message">Message</label>
          <input
            id="message"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Write your message here"
            required
          />
          <button className="help-button" type="button" onClick={() => setShowHelp((visible) => !visible)}>
            {showHelp ? 'Hide help' : 'Need help?'}
          </button>
          {showHelp && <p className="help-tooltip">Briefly introduce yourself and explain how you would like to connect.</p>}
          <button type="submit">Send Message</button>
        </form>
        {submitted && <p className="success-message">Thanks! Your message is ready to send to {portfolio.contact.email}.</p>}
      </section>
    </main>
  )
}

export default Contact
