import About from '../components/About'
import Header from '../components/Header'
import Skills from '../components/Skills'
import { portfolio } from '../data/portfolio'

function Home() {
  return (
    <main>
      <Header name={portfolio.name} role={portfolio.role} university={portfolio.university} />
      <About name={portfolio.name} bio={portfolio.bio} />
      <Skills skills={portfolio.skills} />
    </main>
  )
}

export default Home
