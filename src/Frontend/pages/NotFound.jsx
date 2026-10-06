import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <main className="page-content not-found-page">
      <section className="section text-center">
        <p className="eyebrow">404 Error</p>
        <h1 className="page-title">Page Not Found</h1>
        <p>Sorry, the page you are looking for does not exist or has been moved.</p>
        <Link to="/" className="back-home-btn">
          Back to Home
        </Link>
      </section>
    </main>
  )
}

export default NotFound
