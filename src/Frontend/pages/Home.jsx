import { useEffect } from 'react'
import Header from '../components/Header'
import About from '../components/About'
import Skills from '../components/Skills'
import Projects from './Projects'
import Tasks from './Tasks'
import Contact from './Contact'

function Home({ portfolio }) {
  useEffect(() => {
    // Ensure scroll position starts at top of Home page
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [])

  if (!portfolio) {
    return null
  }

  return (
    <div className="single-page-wrapper">
      {/* Section 1: Home (Hero, About, Skills) */}
      <section id="home" className="page-section" aria-label="Home section">
        <Header
          name={portfolio.name}
          role={portfolio.role}
          university={portfolio.university}
        />
        <About name={portfolio.name} bio={portfolio.bio} />
        <Skills skills={portfolio.skills} />
      </section>

      {/* Section 2: Projects (GitHub Repositories) */}
      <section id="projects" className="page-section" aria-label="Projects section">
        <Projects isEmbedded />
      </section>

      {/* Section 3: Tasks (Full-Stack Task CRUD) */}
      <section id="tasks" className="page-section" aria-label="Tasks section">
        <Tasks isEmbedded />
      </section>

      {/* Section 4: Contact (Interactive Message Form) */}
      <section id="contact" className="page-section" aria-label="Contact section">
        <Contact portfolio={portfolio} isEmbedded />
      </section>
    </div>
  )
}

export default Home
