# SkillNest Backend API Server

Express.js & MongoDB REST API server powering the **SkillNest Mini Product Platform**.

---

## ⚡ Features

- **Authentication**: JWT token issuance, bcrypt password hashing, session checking middleware (`auth.middleware.js`).
- **Course API**: Public GET catalog endpoints, protected Admin POST/PUT/DELETE CRUD routes.
- **Enrollment API**: Student course enrollment & Admin system-wide enrollment reporting.
- **Database Seeder**: Automated database seeder (`seed.js`) for seeding test courses and accounts.

---

## 🚀 Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Seed database
node seed.js

# 3. Start server
node server.js
```

---

## 🔑 REST API Endpoints

### Auth Routes (`/api/auth`)
- `POST /api/auth/register` - Create new student/admin account
- `POST /api/auth/login` - Authenticate and get JWT token
- `GET /api/auth/me` - Get logged-in user profile (Protected)

### Course Routes (`/api/courses`)
- `GET /api/courses` - List courses (supports `search`, `category`, `level` queries)
- `GET /api/courses/:id` - Get single course details
- `POST /api/courses` - Create new course (Admin Protected)
- `PUT /api/courses/:id` - Update existing course (Admin Protected)
- `DELETE /api/courses/:id` - Remove course (Admin Protected)

### Enrollment Routes (`/api/enrollments`)
- `POST /api/enrollments/:courseId` - Enroll student in course (Protected)
- `GET /api/enrollments/my-courses` - Get enrolled courses for student (Protected)
- `GET /api/enrollments/admin/all` - View all platform enrollments (Admin Protected)

Refer to the main [Root README](../README.md) for environment setup and reviewer credentials.
