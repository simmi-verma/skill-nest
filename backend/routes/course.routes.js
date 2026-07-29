import express from 'express';
import Course from '../models/course.model.js';
import { protect, adminOnly } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { search, category, level } = req.query;
    let query = {};

    if (category) {
      query.category = category;
    }

    if (level) {
      query.level = level;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { instructor: { $regex: search, $options: 'i' } },
      ];
    }

    const courses = await Course.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: courses.length, data: courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    res.json({ success: true, data: course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { title, description, category, instructor, price, duration, level, image, syllabus } = req.body;

    const course = await Course.create({
      title,
      description,
      category,
      instructor,
      price: Number(price),
      duration,
      level,
      image,
      syllabus: Array.isArray(syllabus) ? syllabus : (syllabus ? syllabus.split('\n').filter(Boolean) : []),
    });

    res.status(201).json({ success: true, data: course });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const { title, description, category, instructor, price, duration, level, image, syllabus } = req.body;
    
    if (title) course.title = title;
    if (description) course.description = description;
    if (category) course.category = category;
    if (instructor) course.instructor = instructor;
    if (price !== undefined) course.price = Number(price);
    if (duration) course.duration = duration;
    if (level) course.level = level;
    if (image) course.image = image;
    if (syllabus) {
      course.syllabus = Array.isArray(syllabus) ? syllabus : syllabus.split('\n').filter(Boolean);
    }

    const updatedCourse = await course.save();
    res.json({ success: true, data: updatedCourse });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    await Course.deleteOne({ _id: req.params.id });
    res.json({ success: true, message: 'Course removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
