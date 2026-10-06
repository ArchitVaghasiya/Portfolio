function About({ name, bio }) {
  return (
    <section className="section about-section" id="about" aria-labelledby="about-heading">
      <div className="section-header">
        <p className="eyebrow">Background</p>
        <h2 id="about-heading" className="section-title">About Me</h2>
      </div>
      <div className="about-card glass-panel">
        <p className="about-bio">
          Hi, I&rsquo;m <strong>{name}</strong>. {bio}
        </p>
        <div className="about-highlights">
          <div className="highlight-pill">
            <span className="pill-icon">💻</span>
            <span>Full-Stack Development</span>
          </div>
          <div className="highlight-pill">
            <span className="pill-icon">⚡</span>
            <span>IoT & Embedded Systems</span>
          </div>
          <div className="highlight-pill">
            <span className="pill-icon">🧠</span>
            <span>Machine Learning</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
