// =============================================================================
// VERCEL SERVERLESS FUNCTION ENTRY POINT
// =============================================================================
// Vercel routes any request matching /api/* to this serverless handler.
// It wraps the Express app without requiring app.listen().
// =============================================================================

import app from '../src/Backend/app.js'

export default app
