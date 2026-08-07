function About({ name, bio }) {
  return (
    <section className="section" id="about" aria-labelledby="about-heading">
      <h2 id="about-heading">About Me</h2>
      <p>Hi, I’m {name}. {bio}</p>
    </section>
  )
}

export default About
