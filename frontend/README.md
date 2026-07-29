# SkillNest Frontend Client

React 18 + Vite single page application for the **SkillNest Mini Product Platform**.

---

## ⚡ Features

- **Authentication**: Student & Admin JWT session management via `AuthContext`.
- **Course Discovery**: Live keyword search, category filter, and difficulty level filtering.
- **Syllabus & Enrollment**: Interactive curriculum modal with one-click course enrollment.
- **Student Dashboard**: Tracks enrolled courses & learning materials.
- **Admin Portal**: Revenue metrics, Course CRUD operations (Create, Edit, Delete), and system enrollment log table.

---

## 🚀 Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Build for production
npm run build
```

---

## 🌐 Environment Settings

Set the backend API endpoint URL in `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Refer to the main [Root README](../README.md) for full project documentation and credentials.
