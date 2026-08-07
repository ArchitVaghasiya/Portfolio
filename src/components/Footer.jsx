import ContactIcon from './ContactIcon'

function Footer({ name, contact }) {
  return (
    <footer className="site-footer">
      <p>© 2026 {name}. Built with React and Vite.</p>
      <div className="contact-links">
        <a className="contact-icon" href={`mailto:${contact.email}`} aria-label={`Email ${name}`} title={contact.email}>
          <ContactIcon type="email" />
        </a>
        <a className="contact-icon" href={`https://github.com/${contact.github}`} target="_blank" rel="noreferrer" aria-label={`${name}'s GitHub`} title={`GitHub: ${contact.github}`}>
          <ContactIcon type="github" />
        </a>
        <span className="contact-icon" aria-label={`LinkedIn: ${contact.linkedin}`} title={`LinkedIn: ${contact.linkedin}`}>
          <ContactIcon type="linkedin" />
        </span>
      </div>
    </footer>
  )
}

export default Footer
