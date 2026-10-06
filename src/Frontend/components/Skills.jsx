function Skills({ skills }) {
  if (!skills || skills.length === 0) return null

  return (
    <section className="section skills-section" id="skills" aria-labelledby="skills-heading">
      <div className="section-header">
        <p className="eyebrow">Expertise</p>
        <h2 id="skills-heading" className="section-title">Technical Skills</h2>
      </div>
      <div className="skill-grid">
        {skills.map((skill) => (
          <div className="skill-card glass-panel" key={skill}>
            <span className="skill-dot" aria-hidden="true" />
            <span className="skill-name">{skill}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Skills
