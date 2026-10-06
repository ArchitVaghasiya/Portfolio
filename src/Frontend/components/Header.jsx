import { useState, useEffect } from 'react'
import BlurText from './BlurText'
import TechText from './TechText'

function Header({ name, role, university, themeColor }) {
  const headerStyle = themeColor ? { backgroundColor: themeColor } : undefined
  const displayName = name || 'Archit Vaghasiya'

  const [isDark, setIsDark] = useState(() =>
    typeof document !== 'undefined' ? document.body.classList.contains('dark-theme') : false
  )
  const [blurComplete, setBlurComplete] = useState(false)

  // Synchronize dynamic theme colors for TechText canvas
  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.body.classList.contains('dark-theme'))
    }
    const observer = new MutationObserver(checkTheme)
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  // Fallback to ensure TechText reveals even under reduced motion or delayed paint
  useEffect(() => {
    const timer = setTimeout(() => {
      setBlurComplete(true)
    }, 850)
    return () => clearTimeout(timer)
  }, [])

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header className="site-header" style={headerStyle}>
      <div className="hero-glow" aria-hidden="true" />

      <div className="status-pill">
        <span className="status-dot" aria-hidden="true" />
        <span>Available for Projects & Internships</span>
      </div>

      <h1 className="hero-title-group">
        <span className="hero-greeting">
          <BlurText
            text="Hi, I’m"
            delay={140}
            animateBy="words"
            direction="top"
            stepDuration={0.45}
            className="hero-greeting-blur"
            as="span"
            onAnimationComplete={() => setBlurComplete(true)}
          />
        </span>

        <span className={`hero-techtext-wrapper ${blurComplete ? 'revealed' : ''}`}>
          <TechText
            text={displayName}
            fontFamily="'Outfit', 'Plus Jakarta Sans', sans-serif"
            fontWeight={800}
            fontSize={120}
            letterSpacing={-0.03}
            reveal="letter"
            dashLength={4}
            dashGap={2}
            strokeWidth={1.5}
            lineStyle="dashed"
            specks={12}
            selection={true}
            labels={true}
            draggable={true}
            sweep={true}
            speed={0.35}
            color={isDark ? '#f8fafc' : '#0f172a'}
            accentColor={isDark ? '#38bdf8' : '#0284c7'}
          />
        </span>
      </h1>

      <p className="hero-role">{role}</p>
      <p className="hero-university">🎓 {university}</p>

      <div className="hero-actions">
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => scrollTo('projects')}
        >
          View Projects ↓
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => scrollTo('contact')}
        >
          Get in Touch
        </button>
      </div>
    </header>
  )
}

export default Header
