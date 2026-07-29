# 🎓 SkillNest - Mini Product Platform

> **Web Developer Intern Assignment Submission**  
> A full-stack MERN application & marketing site platform enabling students to discover, explore, and enroll in short technical workshops and bootcamps.

---

## 📋 Table of Contents
- [Project Overview](#-project-overview)
- [Tech Stack](#-tech-stack)
- [Key Features](#-key-features)
- [Project Architecture](#-project-architecture)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Evaluator Test Credentials](#-evaluator-test-credentials)
- [Deployment Strategy](#-deployment-strategy)
- [Documentation & Guides](#-documentation--guides)

---

## 🌟 Project Overview

**SkillNest** bridges university theory and industry developer requirements by offering short-term, high-impact workshops in Full-Stack Web Development, UI/UX Design, Data Structures & Algorithms, and Digital Marketing.

The platform is designed in two complementary layers:
1. **Public Marketing Website**: A conversion-optimized site built for Hostinger WordPress hosting (Home, About, Courses, Contact) to acquire prospective students.
2. **MERN Web Application**: An interactive single-page web app built with React, Node.js, Express, and MongoDB featuring JWT authentication, role-based protection, catalog filtering, student enrollment, and an instructor/admin dashboard.

---

## 💻 Tech Stack

### Frontend
- **Framework**: React 18 + Vite
- **Routing**: React Router DOM (v6)
- **State & Context**: React Context API (`AuthContext`)
- **Styling**: Vanilla CSS Design Tokens (Custom Theme Palette, HSL Variables, Glassmorphism Cards)

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (via Mongoose ODM)
- **Security**: JWT (JSON Web Tokens), `bcryptjs` password hashing, CORS protection

---

## ✨ Key Features

### 🧑‍🎓 Student Portal
- **Interactive Course Discovery**: Search by keyword, filter by category (Programming, Design, Computer Science, Marketing), or difficulty level (Beginner, Intermediate, Advanced).
- **Curriculum Transparency**: Detailed course page breaking down duration, price, instructor credentials, and weekly syllabus modules.
- **1-Click Enrollment**: Seamless workshop enrollment linked to the student profile.
- **Student Dashboard**: Track active course enrollments and learning progress.

### 👨‍💼 Admin & Instructor Portal
- **Revenue & Enrollment Analytics**: Real-time KPI summary cards (Total Courses, Total Enrollments, Total Platform Revenue).
- **Course Management (CRUD)**: Create new workshops, update existing pricing/curriculum, or delete retired programs.
- **System Enrollment Logs**: Complete audit table displaying student emails, enrolled courses, and enrollment timestamps.

---

## 📂 Project Architecture

```
Task/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB Mongoose connection
│   ├── middleware/
│   │   └── auth.middleware.js    # JWT verification & admin guard
│   ├── models/
│   │   ├── user.model.js         # Student & Admin schema with bcrypt hooks
│   │   ├── course.model.js       # Workshop catalog schema
│   │   └── enrollment.model.js   # Student enrollment mapping
│   ├── routes/
│   │   ├── auth.routes.js        # Register, Login, Me endpoints
│   │   ├── course.routes.js      # Public listing & Admin CRUD routes
│   │   └── enrollment.routes.js  # Student enroll & Admin log endpoints
│   ├── seed.js                   # Database seeder script
│   ├── server.js                 # Express server entrypoint
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.jsx        # Navigation header with role conditional links
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Global JWT session management
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx   # Hero section & featured catalog
│   │   │   ├── CoursesPage.jsx   # Catalog with live search & filters
│   │   │   ├── CourseDetailsPage.jsx # Syllabus & enrollment view
│   │   │   ├── AuthPage.jsx      # Toggleable Login / Register modal
│   │   │   ├── StudentDashboard.jsx  # Student enrolled courses view
│   │   │   └── AdminDashboard.jsx    # Admin CRUD & analytics portal
│   │   ├── styles/
│   │   │   ├── theme.css         # Design tokens & color system
│   │   │   ├── global.css        # Base layout resets
│   │   │   └── components.css    # Card, table, & modal styles
│   │   ├── App.jsx               # Client routes setup
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
└── docs/
    ├── hostinger_wordpress_guide.md  # Hostinger WP deployment blueprint
    └── mern_deployment_guide.md       # Render, Vercel & Atlas deployment guide
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas connection string)

### 1. Installation

Clone the repository and install dependencies for both services:

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Database Seeding

Populate MongoDB with default workshops and reviewer accounts:

```bash
cd backend
node seed.js
```

### 3. Launch Development Servers

Run the backend server and frontend client concurrently:

```bash
# Terminal 1: Backend Server (Port 5000)
cd backend
node server.js

# Terminal 2: Frontend Client (Port 5173)
cd frontend
npm run dev
```

Access the app in your browser at `http://localhost:5173`.

---

## 🔑 Environment Variables

### Backend (`backend/.env`)
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/skillnest
JWT_SECRET=skillnest_super_secret_key_2026_safe
NODE_ENV=development
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🔐 Evaluator Test Credentials

Pre-seeded database accounts for quick review:

| Role | Email | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| 🧑‍🎓 **Student** | `student@skillnest.com` | `studentpassword` | Search catalog, view syllabus, enroll in workshops, track courses on Student Dashboard |
| 👨‍💼 **Admin** | `admin@skillnest.com` | `adminpassword` | Full CRUD operations, launch/edit workshops, view platform revenue & student enrollment logs |

---

## ☁️ Deployment Strategy

- **Database**: Hosted on **MongoDB Atlas** (Free Tier M0 Cluster).
- **Backend API**: Hosted on **Render** / **Railway** as a Node.js web service.
- **Frontend SPA**: Hosted on **Vercel** / **Netlify** with automatic Vite builds.
- **Marketing Site**: Provisioned on **Hostinger** using WordPress, Astra Theme, and Elementor.

---

## 📖 Documentation & Guides

- 🌐 [Hostinger WordPress Setup Guide](docs/hostinger_wordpress_guide.md)
- ☁️ [MERN Cloud Deployment Guide](docs/mern_deployment_guide.md)

---

&copy; SkillNest Mini Product Platform. Developed for Web Developer Intern Evaluation.
