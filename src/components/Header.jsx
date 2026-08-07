function Header({ name, role, university }) {
  return (
    <header className="site-header">
      <p className="eyebrow">Student Portfolio</p>
      <h1>{name}</h1>
      <p>{role}</p>
      <p className="university">{university}</p>
    </header>
  )
}

export default Header
