import { lazy, Suspense, useEffect, useState } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'
import Footer from './components/Footer'
import NavBar from './components/NavBar'
import Spinner from './components/Spinner'
import ClickSpark from './components/ClickSpark'
import { fetchPortfolio } from './services/api'
import { fallbackPortfolio } from './data/fallbackData'
import './App.css'

// Practical 8: Lazy load route components for performance optimization and code splitting
const Home = lazy(() => import('./pages/Home'))
const Projects = lazy(() => import('./pages/Projects'))
const Tasks = lazy(() => import('./pages/Tasks'))
const Contact = lazy(() => import('./pages/Contact'))
const NotFound = lazy(() => import('./pages/NotFound'))

function App() {
  const navigate = useNavigate()
  const [portfolio, setPortfolio] = useState(fallbackPortfolio)

  // Enforce returning to top of Home section on page refresh or initial load
  useEffect(() => {
    if (window.location.hash || window.location.pathname !== '/') {
      window.history.replaceState(null, '', '/')
      navigate('/', { replace: true })
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })

    const handleBeforeUnload = () => {
      window.scrollTo(0, 0)
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [navigate])

  // Practical 2 Supplementary: Dark/Light mode toggle state
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('portfolio_theme') === 'dark'
  })

  // Synchronize dark-theme class on entire page (html and body)
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark-theme')
      document.body.classList.add('dark-theme')
    } else {
      document.documentElement.classList.remove('dark-theme')
      document.body.classList.remove('dark-theme')
    }
  }, [darkMode])

  useEffect(() => {
    const controller = new AbortController()

    async function loadPortfolio() {
      try {
        const data = await fetchPortfolio(controller.signal)
        if (data) {
          setPortfolio(data)
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          // Graceful fallback
        }
      }
    }

    loadPortfolio()
    return () => controller.abort()
  }, [])

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const next = !prev
      localStorage.setItem('portfolio_theme', next ? 'dark' : 'light')
      return next
    })
  }

  return (
    <ClickSpark
      sparkColor={darkMode ? '#38bdf8' : '#0284c7'}
      sparkSize={12}
      sparkRadius={20}
      sparkCount={8}
      duration={400}
      easing="ease-out"
      extraScale={1.2}
    >
      <div className={`portfolio ${darkMode ? 'dark-theme' : ''}`}>
        <NavBar darkMode={darkMode} onToggleDarkMode={toggleDarkMode} />
        {/* Practical 8: Route-level Suspense wrapper with fallback UI */}
        <Suspense fallback={<div className="route-fallback"><Spinner /></div>}>
          <Routes>
            <Route path="/" element={<Home portfolio={portfolio} />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/contact" element={<Contact portfolio={portfolio} />} />
            {/* Practical 2 Supplementary & Post-lab: 404 Not Found route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        <Footer name={portfolio.name} contact={portfolio.contact} />
      </div>
    </ClickSpark>
  )
}

export default App
