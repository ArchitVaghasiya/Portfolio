function RepoList({ data }) {
  if (data.length === 0) {
    return <p>No public repositories found yet.</p>
  }

  return (
    <div className="project-grid">
      {data.map((repository) => (
        <article className="project-card" key={repository.id}>
          <h2>{repository.name}</h2>
          <p>{repository.description || 'A GitHub project by Archit Vaghasiya.'}</p>
          <a className="repo-link" href={repository.html_url} target="_blank" rel="noreferrer">
            View repository
          </a>
        </article>
      ))}
    </div>
  )
}

export default RepoList
