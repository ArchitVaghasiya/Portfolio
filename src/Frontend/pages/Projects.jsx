import { useEffect, useState, useMemo } from 'react'
import ErrorMessage from '../components/ErrorMessage'
import RepoList from '../components/RepoList'
import Spinner from '../components/Spinner'
import CircularCarousel from '../components/CircularCarousel'
import { fetchProjects } from '../services/api'
import { generateRepoCardSvg } from '../utils/repoCardSvg'

function Projects({ isEmbedded = false }) {
  const [repos, setRepos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [fetchTrigger, setFetchTrigger] = useState(0)
  const [activeRepoIndex, setActiveRepoIndex] = useState(0)
  const [viewMode, setViewMode] = useState('carousel') // 'carousel' | 'grid'

  useEffect(() => {
    const controller = new AbortController()

    async function load() {
      try {
        const repositories = await fetchProjects(controller.signal)
        setRepos(repositories)
        setError(null)
      } catch (fetchError) {
        if (fetchError.name !== 'AbortError') {
          setError(fetchError.message || 'Failed to load projects')
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    load()
    return () => controller.abort()
  }, [fetchTrigger])

  const handleRetry = () => {
    setLoading(true)
    setError(null)
    setFetchTrigger((c) => c + 1)
  }

  // Derive matching repository index from search query using useMemo
  const searchedRepoIndex = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q || repos.length === 0) return null

    const matchIdx = repos.findIndex(
      (r) =>
        r.name?.toLowerCase().includes(q) ||
        r.description?.toLowerCase().includes(q) ||
        r.language?.toLowerCase().includes(q),
    )

    return matchIdx !== -1 ? matchIdx : null
  }, [searchQuery, repos])

  // Filter repository list for the grid view
  const filteredRepos = useMemo(() => {
    if (!searchQuery.trim()) return repos
    const query = searchQuery.toLowerCase()
    return repos.filter(
      (repo) =>
        repo.name?.toLowerCase().includes(query) ||
        repo.description?.toLowerCase().includes(query),
    )
  }, [repos, searchQuery])

  // Generate SVG cards for the 3D Circular Carousel
  const carouselItems = useMemo(() => {
    return repos.map((repo, idx) => ({
      src: generateRepoCardSvg(repo, idx),
      alt: repo.description || repo.name,
      title: repo.name,
      subtitle: repo.language || 'GitHub Project',
      html_url: repo.html_url,
      repo,
    }))
  }, [repos])

  const currentFrontRepo = repos[activeRepoIndex] || repos[0]
  const isMatched = searchQuery.trim() && searchedRepoIndex !== null && repos[searchedRepoIndex]

  return (
    <main className="page-content">
      <section
        className="section projects-section"
        {...(!isEmbedded ? { id: 'projects' } : {})}
        aria-labelledby="projects-heading"
      >
        <p className="eyebrow">My Work</p>
        <h1 id="projects-heading" className="page-title">GitHub Projects</h1>

        {/* Controls Bar: Search Input with Auto-Rotate + View Toggle */}
        <div className="projects-controls">
          <div className="search-input-wrapper">
            <span className="search-input-icon" aria-hidden="true">🔍</span>
            <input
              type="search"
              className="search-input search-input-with-icon"
              placeholder="Search repositories to rotate 3D ring… (e.g. Chaos, Exam, React)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search repositories"
            />
          </div>

          <div className="view-toggle-group" role="group" aria-label="Projects view mode">
            <button
              type="button"
              className={`view-toggle-btn ${viewMode === 'carousel' ? 'active' : ''}`}
              onClick={() => setViewMode('carousel')}
              aria-pressed={viewMode === 'carousel'}
            >
              <span>🪐</span> 3D Ring View
            </button>
            <button
              type="button"
              className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              aria-pressed={viewMode === 'grid'}
            >
              <span>⊞</span> Grid View
            </button>
          </div>
        </div>

        {loading && <Spinner />}

        {error && (
          <div className="error-container">
            <ErrorMessage message={error} />
            <button
              type="button"
              className="retry-button"
              onClick={handleRetry}
            >
              🔄 Retry Fetch
            </button>
          </div>
        )}

        {!loading && !error && repos.length > 0 && (
          <>
            {viewMode === 'carousel' ? (
              <>
                {/* 3D Circular Carousel Component from React Bits */}
                <div className="carousel-stage-wrapper">
                  {isMatched && (
                    <div className="carousel-search-badge">
                      <span>🎯 Auto-Rotated to:</span>
                      <strong>{repos[searchedRepoIndex].name}</strong>
                    </div>
                  )}

                  <CircularCarousel
                    items={carouselItems}
                    preset="cylinder"
                    intro="rise"
                    cardWidth={280}
                    aspectRatio={1}
                    gap={30}
                    speed={3.5}
                    captions
                    selectedIndex={searchedRepoIndex !== null ? searchedRepoIndex : undefined}
                    onChange={(idx) => setActiveRepoIndex(idx)}
                    onItemClick={(item) => {
                      if (item?.html_url) {
                        window.open(item.html_url, '_blank')
                      }
                    }}
                  />

                  <div className="carousel-hint-text">
                    ↻ Drag or throw the 3D ring • Click any card to focus & explore on GitHub
                  </div>
                </div>

                {/* Featured Spotlight Card for Front Repository */}
                {currentFrontRepo && (
                  <article className="repo-spotlight-card glass-panel" aria-label="Featured repository">
                    <div className="spotlight-info">
                      <span className="spotlight-badge">Selected Repository</span>
                      <div className="spotlight-title-row">
                        <h2 className="spotlight-title">{currentFrontRepo.name}</h2>
                      </div>
                      <p className="spotlight-desc">
                        {currentFrontRepo.description || 'Open-source GitHub project by Archit Vaghasiya.'}
                      </p>
                      <div className="spotlight-meta">
                        {currentFrontRepo.language && (
                          <span className="spotlight-lang">
                            <span className="spotlight-lang-dot" style={{ backgroundColor: '#0284c7' }} />
                            <span>{currentFrontRepo.language}</span>
                          </span>
                        )}
                        <span>⭐ {currentFrontRepo.stargazers_count ?? 0} stars</span>
                        <span>🍴 {currentFrontRepo.forks_count ?? 0} forks</span>
                      </div>
                    </div>

                    <a
                      href={currentFrontRepo.html_url}
                      target="_blank"
                      rel="noreferrer"
                      className="spotlight-link-btn"
                    >
                      View on GitHub ↗
                    </a>
                  </article>
                )}
              </>
            ) : (
              <RepoList data={filteredRepos} />
            )}
          </>
        )}

        {!loading && !error && repos.length === 0 && (
          <p>No repositories available.</p>
        )}
      </section>
    </main>
  )
}

export default Projects
