import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import { autoSeedIfEmpty } from './config/autoSeed.js';

import authRoutes from './routes/auth.routes.js';
import courseRoutes from './routes/course.routes.js';
import enrollmentRoutes from './routes/enrollment.routes.js';

dotenv.config();

// Connect DB and trigger auto-seed if empty
connectDB().then(() => {
  autoSeedIfEmpty();
});

const app = express();

app.use(cors());
app.use(express.json());

// Normalize URL paths to fix accidental double slashes like //auth/register
app.use((req, res, next) => {
  req.url = req.url.replace(/\/+/g, '/');
  next();
});

// Request logger for local debugging
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.originalUrl}`);
  next();
});

app.get('/', (req, res) => {
  res.json({
    name: 'SkillNest Mini Product Platform API',
    status: 'healthy',
    version: '1.0.0',
    availableEndpoints: [
      'GET  /',
      'GET  /api/courses',
      'GET  /api/courses/:id',
      'POST /api/courses (Admin)',
      'PUT  /api/courses/:id (Admin)',
      'DELETE /api/courses/:id (Admin)',
      'POST /api/auth/register',
      'POST /api/auth/login',
      'GET  /api/auth/me',
      'POST /api/enrollments/:courseId',
      'GET  /api/enrollments/my-courses',
      'GET  /api/enrollments/admin/all (Admin)'
    ]
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);

app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: `Endpoint not found: ${req.method} ${req.originalUrl}`,
    tip: 'All API routes require the /api prefix. For example: GET /api/courses'
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'An internal server error occurred',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
