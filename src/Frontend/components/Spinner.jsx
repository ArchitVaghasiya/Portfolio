function Spinner() {
  return (
    <div className="spinner-wrapper" role="status">
      <span className="spinner" aria-hidden="true" />
      <span>Loading repositories…</span>
    </div>
  )
}

export default Spinner
