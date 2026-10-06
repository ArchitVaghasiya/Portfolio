# Backend API Architecture & Developer Guide

This document explains the structure and flow of the Express REST API in this project.

---

## 1. Directory Structure

```text
src/Backend/
├── config/
│   └── db.js                 # Database connection logic (Mongoose + in-memory fallback)
├── controllers/              # Business logic (what happens when a route is called)
│   ├── authController.js     # User registration, login, and profile fetching
│   ├── contactController.js  # Contact message processing
│   ├── portfolioController.js# Portfolio profile and skill data
│   ├── projectsController.js # GitHub repository proxy
│   └── taskController.js     # Task CRUD functions (Create, Read, Update, Delete)
├── data/
│   └── portfolioData.js      # Raw portfolio dataset (name, bio, skills, links)
├── middleware/
│   └── authMiddleware.js     # JWT token verification (protects private endpoints)
├── models/
│   ├── Task.js               # Mongoose schema for tasks
│   └── User.js               # Mongoose schema for users
├── routes/                   # Route URL path definitions
│   ├── authRoutes.js         # /api/auth
│   ├── contactRoutes.js      # /api/contact
│   ├── portfolioRoutes.js    # /api/portfolio
│   ├── projectsRoutes.js     # /api/projects
│   └── taskRoutes.js         # /api/tasks
└── server.js                 # Application entry point & middleware pipeline
```

---

## 2. The 3-Tier Pattern (Route → Controller → Model)

Every API request follows this standard, easy-to-follow flow:

1. **Router (`routes/`)**: Listens for the URL and HTTP verb (e.g. `POST /api/tasks`) and points to a controller function.
2. **Controller (`controllers/`)**:
   - Step 1: Reads incoming data (`req.body` or `req.params`).
   - Step 2: Validates the data (e.g. checks that title is not empty).
   - Step 3: Talks to the Model/Database (`Task.create(...)`).
   - Step 4: Sends back a JSON response with status code (`res.status(201).json(...)`).
3. **Model (`models/`)**: Defines what the data looks like and its validation rules in MongoDB.

---

## 3. Complete API Endpoints Table

| Resource | HTTP Method | Endpoint | Description | Status Code |
| :--- | :--- | :--- | :--- | :--- |
| **Health** | `GET` | `/api/health` | Check if backend is alive | `200 OK` |
| **Portfolio** | `GET` | `/api/portfolio` | Get student profile, bio, skills | `200 OK` |
| **Projects** | `GET` | `/api/projects` | Get GitHub repository list | `200 OK` |
| **Contact** | `POST` | `/api/contact` | Submit contact form message | `201 Created` |
| **Tasks** | `GET` | `/api/tasks` | Fetch all tasks | `200 OK` |
| **Tasks** | `GET` | `/api/tasks/:id` | Fetch single task by ID | `200 OK` / `404 Not Found` |
| **Tasks** | `POST` | `/api/tasks` | Create a new task | `201 Created` / `400 Bad Request` |
| **Tasks** | `PUT` | `/api/tasks/:id` | Update an existing task | `200 OK` / `404 Not Found` |
| **Tasks** | `DELETE` | `/api/tasks/:id` | Delete a task | `200 OK` / `404 Not Found` |
| **Auth** | `POST` | `/api/auth/register`| Register user (bcrypt hashed) | `201 Created` |
| **Auth** | `POST` | `/api/auth/login` | Login user & get JWT token | `200 OK` / `401 Unauthorized` |
| **Auth** | `GET` | `/api/auth/me` | Get logged-in user profile | `200 OK` (Requires Bearer token) |

---

## 4. Key Concepts Often Asked in Lab Vivas

1. **Why is `cors()` needed?**  
   The frontend runs on port `5173` and the backend runs on port `5000`. By default, browsers block requests between different ports (Cross-Origin Resource Sharing). `cors()` tells the browser to allow these requests.

2. **Why does `express.json()` exist?**  
   Node.js receives request bodies as raw binary streams. `express.json()` automatically parses the stream into a clean JavaScript object available at `req.body`.

3. **Why must the Error Handling Middleware be defined last in `server.js`?**  
   Express evaluates middlewares from top to bottom. If an error occurs inside any route, Express skips normal middlewares and jumps to the first middleware that accepts 4 parameters `(err, req, res, next)`. If placed at the top, it would never catch errors from routes defined below it.

4. **What is the difference between `200 OK` and `201 Created`?**  
   `200 OK` is standard for successful reads and updates. `201 Created` is specifically reserved for when a new entity was created and stored in the database.
