import { useEffect, useState } from 'react'
import ErrorMessage from '../components/ErrorMessage'
import RepoList from '../components/RepoList'
import Spinner from '../components/Spinner'

function Projects() {
  const [repos, setRepos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const controller = new AbortController()

    async function fetchRepositories() {
      try {
        const response = await fetch('https://api.github.com/users/ArchitVaghasiya/repos?sort=updated', {
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error('Unable to load GitHub repositories right now.')
        }

        const repositories = await response.json()
        setRepos(repositories)
      } catch (fetchError) {
        if (fetchError.name !== 'AbortError') {
          setError(fetchError.message)
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    fetchRepositories()
    return () => controller.abort()
  }, [])

  if (loading) {
    return <Spinner />
  }

  if (error) {
    return <ErrorMessage message={error} />
  }

  return (
    <main className="page-content">
      <section className="section" aria-labelledby="projects-heading">
        <p className="eyebrow">My Work</p>
        <h1 id="projects-heading" className="page-title">GitHub Projects</h1>
        <RepoList data={repos} />
      </section>
    </main>
  )
}

export default Projects
