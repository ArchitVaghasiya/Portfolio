import ContactIcon from './ContactIcon'

function Footer({ name, contact }) {
  const email = contact?.email || ''
  const github = contact?.github || ''
  const linkedin = contact?.linkedin || ''

  return (
    <footer className="site-footer">
      <p>© 2026 {name}. Built with React and Vite.</p>
      <div className="contact-links">
        {email && (
          <a className="contact-icon" href={`mailto:${email}`} aria-label={`Email ${name}`} title={email}>
            <ContactIcon type="email" />
          </a>
        )}
        {github && (
          <a className="contact-icon" href={`https://github.com/${github}`} target="_blank" rel="noreferrer" aria-label={`${name}'s GitHub`} title={`GitHub: ${github}`}>
            <ContactIcon type="github" />
          </a>
        )}
        {linkedin && (
          <a
            className="contact-icon"
            href={linkedin.startsWith('http') ? linkedin : `https://www.linkedin.com/in/${encodeURIComponent(linkedin.toLowerCase().replace(/\s+/g, '-'))}`}
            target="_blank"
            rel="noreferrer"
            aria-label={`${name}'s LinkedIn`}
            title={`LinkedIn: ${linkedin}`}
          >
            <ContactIcon type="linkedin" />
          </a>
        )}
      </div>
    </footer>
  )
}

export default Footer
