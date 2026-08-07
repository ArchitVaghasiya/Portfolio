import { Route, Routes } from 'react-router-dom'
import Footer from './components/Footer'
import NavBar from './components/NavBar'
import Contact from './pages/Contact'
import Home from './pages/Home'
import Projects from './pages/Projects'
import { portfolio } from './data/portfolio'
import './App.css'

function App() {
  return (
    <div className="portfolio">
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      <Footer name={portfolio.name} contact={portfolio.contact} />
    </div>
  )
}

export default App
