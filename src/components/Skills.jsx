function Skills({ skills }) {
  return (
    <section className="section" id="skills" aria-labelledby="skills-heading">
      <h2 id="skills-heading">Skills</h2>
      <ul className="skill-list">
        {skills.map((skill) => <li key={skill}>{skill}</li>)}
      </ul>
    </section>
  )
}

export default Skills
