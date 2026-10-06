# Advanced Web Development Frameworks (ITUE301) - Lab Work

A complete full-stack web application implementing all requirements from **Practical 1 through Practical 8** of the ITUE301 syllabus (Charotar University of Science and Technology).

---

## Practicals Mapping & Implementation Summary

| Practical | Title | Syllabus Requirement | What was Implemented |
| :--- | :--- | :--- | :--- |
| **Practical 1** | **React & Component Architecture** | Vite scaffold, reusable components (`Header`, `About`, `Skills`, `Footer`), props data passing, theme color prop. | Created modular components in `src/Frontend/components/`, dynamic skill rendering via props, inline theme color in `Header.jsx`. |
| **Practical 2** | **State Management & Routing** | React Router 3 routes (`/`, `/projects`, `/contact`), controlled input, `useState` visibility toggle, 404 route, dark/light mode toggle, character count. | Multi-route SPA setup, real-time message state, live character count, help tooltip toggle, custom `NotFound.jsx` (404), `NavLink` active highlighting, dark theme toggle. |
| **Practical 3** | **API Integration & Rendering** | Consume GitHub REST API on `/projects`, loading spinner, error message, search filter input, retry button, star count. | `Projects.jsx` with `fetchProjects`, `Spinner`, `ErrorMessage`, real-time repository search filter, error retry button, and star badges in `RepoList.jsx`. |
| **Practical 4** | **RESTful API with Node & Express** | Express CRUD endpoints for Tasks, logging middleware, global error handler, JSON Content-Type validation, structured 404 responses. | Express app in `src/Backend/server.js`, `taskRoutes.js`, ISO timestamp logger middleware, Content-Type enforcement on POST/PUT, last-in-pipeline error handler. |
| **Practical 5** | **MongoDB & Schema Design** | Mongoose `Task` schema (title, description, completed, priority enum, createdAt), pre-save hook, CRUD operations, structured validation errors. | `Task.js` schema with trim pre-save hook and enum validation, Mongoose integration in `db.js` with auto fallback for offline development. |
| **Practical 6** | **Full Stack Integration** | React Task UI connected to backend CRUD endpoints (`/api/tasks`), persistence, loading/error states, delete confirmation dialog, toast notifications. | Created `Tasks.jsx` page with full CRUD, optimistic UI feedback, confirmation modal before deletion, and auto-dismiss toast alerts. |
| **Practical 7** | **Authentication & Middleware** | User registration/login, bcrypt password hashing, JWT generation (1h expiry), auth middleware (`Authorization: Bearer <token>`), `/me` endpoint. | `User.js` model, `authController.js` (`/register`, `/login`, `/me`), `authMiddleware.js` protecting secure endpoints. |
| **Practical 8** | **Performance & Lazy Loading** | Route-level code splitting using `React.lazy()` and `<Suspense fallback={...}>`. | Route components (`Home`, `Projects`, `Tasks`, `Contact`, `NotFound`) code-split into distinct dynamic chunks (`dist/assets/*.js`). |

---

## Running the Application

### Development Mode (Locally)

```bash
# In Terminal 1 - Start the Backend Server:
npm run server:dev

# In Terminal 2 - Start the Frontend Dev Server:
npm run dev
```

### Validation & Quality Checks

```bash
# Run Linter
npm run lint

# Build Production Bundle
npm run build
```
