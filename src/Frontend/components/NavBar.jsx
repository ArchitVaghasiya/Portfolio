import { useEffect, useState, useCallback, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import GlassSurface from './GlassSurface'

const SECTIONS = [
  { id: 'home', label: 'Home', path: '/' },
  { id: 'projects', label: 'Projects', path: '/projects' },
  { id: 'tasks', label: 'Tasks', path: '/tasks' },
  { id: 'contact', label: 'Contact', path: '/contact' },
]

const SECTION_IDS = ['home', 'projects', 'tasks', 'contact']

function NavBar({ darkMode, onToggleDarkMode }) {
  const [scrollSection, setScrollSection] = useState('home')

  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const isProgrammaticScroll = useRef(false)
  const scrollLockTimer = useRef(null)

  // 1. Calculate active section based on real-time viewport coordinates (scrollspy)
  const calculateActiveSectionOnScroll = useCallback(() => {
    // Only perform scrollspy on the continuous single-page root ("/")
    if (location.pathname !== '/') return
    if (isProgrammaticScroll.current) return

    setIsScrolled(window.scrollY > 20)

    // A. At top of document -> highlight 'home'
    if (window.scrollY < 120) {
      setScrollSection('home')
      return
    }

    // B. At or near bottom of document -> highlight 'contact'
    const scrollBottom = window.innerHeight + window.scrollY
    const totalHeight = document.documentElement.scrollHeight
    if (scrollBottom >= totalHeight - 80) {
      setScrollSection('contact')
      return
    }

    // C. Viewport focal point detection (below sticky navbar)
    // The active section is the lowest section whose top has crossed above the focal point
    const focalPoint = Math.min(260, window.innerHeight * 0.35)
    let currentMatch = 'home'

    for (const id of SECTION_IDS) {
      const el = document.getElementById(id)
      if (!el) continue
      const rect = el.getBoundingClientRect()
      if (rect.top <= focalPoint) {
        currentMatch = id
      }
    }

    setScrollSection(currentMatch)
  }, [location.pathname])

  // 2. High-performance scroll listener using requestAnimationFrame
  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
      if (!ticking) {
        window.requestAnimationFrame(() => {
          calculateActiveSectionOnScroll()
          ticking = false
        })
        ticking = true
      }
    }

    // Release programmatic lock if user manually scrolls with wheel or touch
    const cancelProgrammaticLock = () => {
      isProgrammaticScroll.current = false
      if (scrollLockTimer.current) clearTimeout(scrollLockTimer.current)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('wheel', cancelProgrammaticLock, { passive: true })
    window.addEventListener('touchmove', cancelProgrammaticLock, { passive: true })

    // Non-blocking deferred checks for initial render and post-fetch DOM expansion
    const t0 = setTimeout(calculateActiveSectionOnScroll, 50)
    const t1 = setTimeout(calculateActiveSectionOnScroll, 300)
    const t2 = setTimeout(calculateActiveSectionOnScroll, 1000)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('wheel', cancelProgrammaticLock)
      window.removeEventListener('touchmove', cancelProgrammaticLock)
      clearTimeout(t0)
      clearTimeout(t1)
      clearTimeout(t2)
      if (scrollLockTimer.current) clearTimeout(scrollLockTimer.current)
    }
  }, [calculateActiveSectionOnScroll])

  // 3. Handle browser back/forward URL hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '')
      if (SECTION_IDS.includes(hash)) {
        setScrollSection(hash)
      }
    }
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  // 4. Derive active section according to current route page or scroll position
  let activeSection = 'home'
  if (location.pathname === '/projects') {
    activeSection = 'projects'
  } else if (location.pathname === '/tasks') {
    activeSection = 'tasks'
  } else if (location.pathname === '/contact') {
    activeSection = 'contact'
  } else if (location.pathname === '/') {
    activeSection = scrollSection
  } else {
    activeSection = ''
  }

  // 5. Handle navigation item click with smooth scroll & URL hash sync
  const handleNavClick = (e, id) => {
    e.preventDefault()

    // Immediately reflect selected option in UI
    setScrollSection(id)

    // Lock scrollspy temporarily so smooth-scroll transition doesn't jump intermediate pills
    isProgrammaticScroll.current = true
    if (scrollLockTimer.current) clearTimeout(scrollLockTimer.current)
    scrollLockTimer.current = setTimeout(() => {
      isProgrammaticScroll.current = false
    }, 800)

    if (location.pathname !== '/') {
      navigate('/')
      setTimeout(() => {
        const target = document.getElementById(id)
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 100)
    } else {
      const target = document.getElementById(id)
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }

  return (
    <header className={`navbar-wrapper ${isScrolled ? 'scrolled' : ''}`}>
      <GlassSurface
        width="100%"
        height="auto"
        borderRadius={9999}
        borderWidth={0.06}
        brightness={darkMode ? 35 : 70}
        opacity={darkMode ? 0.85 : 0.9}
        blur={12}
        displace={0}
        backgroundOpacity={darkMode ? 0.3 : 0.2}
        saturation={1.6}
        distortionScale={-120}
        redOffset={2}
        greenOffset={8}
        blueOffset={14}
        className="navbar-glass-surface"
      >
        <nav className="navbar-inner" aria-label="Main navigation">
          <a
            className="brand"
            href="#home"
            onClick={(e) => handleNavClick(e, 'home')}
            aria-label="Archit Vaghasiya Portfolio Homepage"
          >
            <span className="brand-badge">AV</span>
            <span className="brand-text">Archit Vaghasiya</span>
          </a>

          <div className="nav-links">
            {SECTIONS.map(({ id, label, path }) => {
              const isActive = activeSection === id
              return (
                <a
                  key={id}
                  className={`nav-link ${isActive ? 'active' : ''}`}
                  href={location.pathname === '/' ? `#${id}` : path}
                  onClick={(e) => handleNavClick(e, id)}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {label}
                </a>
              )
            })}

            <button
              type="button"
              className="theme-toggle-btn"
              onClick={onToggleDarkMode}
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              <span className="theme-toggle-icon">{darkMode ? '☀️' : '🌙'}</span>
            </button>
          </div>
        </nav>
      </GlassSurface>
    </header>
  )
}

export default NavBar
