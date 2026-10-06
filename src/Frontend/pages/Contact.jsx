import { useState } from 'react'
import { submitContactMessage } from '../services/api'

function Contact({ portfolio, isEmbedded = false }) {
  const [message, setMessage] = useState('')
  const [showHelp, setShowHelp] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [statusFeedback, setStatusFeedback] = useState('')

  const contactEmail = portfolio?.contact?.email || '24ce136@charusat.edu.in'

  async function handleSubmit(event) {
    event.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await submitContactMessage({
        message,
        email: contactEmail,
      })
      setSubmitted(true)
      setStatusFeedback(response.message || `Thanks! Your message is ready to send to ${contactEmail}.`)
      setMessage('')
    } catch {
      setSubmitted(true)
      setStatusFeedback(`Thanks! Your message is ready to send to ${contactEmail}.`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="page-content">
      <section
        className="section contact-section"
        {...(!isEmbedded ? { id: 'contact' } : {})}
        aria-labelledby="contact-heading"
      >
        <p className="eyebrow">Get in Touch</p>
        <h1 id="contact-heading" className="page-title">Contact Me</h1>
        <p>Have a question or want to collaborate? Send me a message below.</p>

        <div className="contact-card-panel glass-panel">
          <form className="contact-form" onSubmit={handleSubmit}>
            <label htmlFor="message">Your Message</label>
            <textarea
              id="message"
              rows="4"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Write your note, feedback, or collaboration idea here…"
              required
              disabled={isSubmitting}
            />

            {/* Practical 2 Supplementary: Live character count below the input */}
            <div className="char-count" aria-live="polite">
              Character count: <strong>{message.length}</strong>
            </div>

            <button className="help-button" type="button" onClick={() => setShowHelp((visible) => !visible)}>
              {showHelp ? 'Hide help' : '💡 Need help?'}
            </button>

            {showHelp && (
              <p className="help-tooltip">
                Briefly introduce yourself, mention your organization/college, and explain how you would like to connect.
              </p>
            )}

            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Sending…' : 'Send Message →'}
            </button>
          </form>

          {submitted && <p className="success-message">{statusFeedback}</p>}
        </div>
      </section>
    </main>
  )
}

export default Contact
