// =============================================================================
// BACKEND SERVER ENTRY POINT (Local Development / Standalone Node)
// =============================================================================
import app from './app.js'

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`🚀 Portfolio backend server running on http://localhost:${PORT}`)
})

export default app
