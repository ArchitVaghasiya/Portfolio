const LANG_COLORS = {
  JavaScript: '#f59e0b',
  TypeScript: '#3b82f6',
  HTML: '#ea580c',
  CSS: '#8b5cf6',
  Python: '#10b981',
  default: '#0284c7',
}

function RepoList({ data }) {
  if (!data || data.length === 0) {
    return <p className="no-repos-msg">No matching repositories found.</p>
  }

  return (
    <div className="project-grid">
      {data.map((repository) => {
        const lang = repository.language || 'Code'
        const langColor = LANG_COLORS[repository.language] || LANG_COLORS.default

        return (
          <article className="project-card glass-panel" key={repository.id}>
            <div className="project-card-body">
              <h2>{repository.name}</h2>
              <p>{repository.description || 'A GitHub project by Archit Vaghasiya.'}</p>
            </div>

            <div className="project-card-footer">
              <span className="repo-lang-tag">
                <span className="repo-lang-dot" style={{ backgroundColor: langColor }} />
                <span>{lang}</span>
              </span>
              <a
                className="repo-link"
                href={repository.html_url}
                target="_blank"
                rel="noreferrer"
              >
                View repository →
              </a>
            </div>
          </article>
        )
      })}
    </div>
  )
}

export default RepoList
