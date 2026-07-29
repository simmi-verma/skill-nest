import User from '../models/user.model.js';
import Course from '../models/course.model.js';
import Enrollment from '../models/enrollment.model.js';

const defaultCourses = [
  {
    title: 'Full-Stack Web Development Bootcamp',
    description: 'Master HTML, CSS, JavaScript, React, Node.js, Express, and MongoDB. Build production-ready web apps from scratch.',
    category: 'Programming',
    instructor: 'Alex Mercer',
    price: 499,
    duration: '12 Weeks',
    level: 'Beginner',
    image: 'https://images.unsplash.com/photo-1547658719-da2b81169144?w=800&auto=format&fit=crop&q=60',
    syllabus: [
      'HTML5, CSS3, & Modern JavaScript (ES6+)',
      'Frontend Component Architecture with React',
      'State Management & Lifecycle Hooks',
      'Backend Rest API development with Node.js & Express',
      'Database Modeling & CRUD Operations with MongoDB',
      'Deployment, JWT Authentication, and Security Best Practices'
    ]
  },
  {
    title: 'UI/UX Design Masterclass',
    description: 'Learn wireframing, high-fidelity UI design, user research, and interactive prototyping in Figma and Adobe XD.',
    category: 'Design',
    instructor: 'Sophia Reed',
    price: 299,
    duration: '6 Weeks',
    level: 'Beginner',
    image: 'https://images.unsplash.com/photo-1561070791-26c113006238?w=800&auto=format&fit=crop&q=60',
    syllabus: [
      'Introduction to User Experience (UX) Research',
      'Figma Tooling, Auto-Layout, and Component Libraries',
      'Wireframing & Information Architecture',
      'Visual Hierarchy & Color Theory',
      'Interactive Prototyping & Usability Testing',
      'Handoff to Development Teams'
    ]
  },
  {
    title: 'Advanced Data Structures & Algorithms',
    description: 'Optimize code performance. Deep dive into trees, graphs, sorting, searching, dynamic programming, and complexity analysis.',
    category: 'Computer Science',
    instructor: 'Dr. Evelyn Foster',
    price: 399,
    duration: '8 Weeks',
    level: 'Advanced',
    image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&auto=format&fit=crop&q=60',
    syllabus: [
      'Big O Notation & Complexity Analysis',
      'Linked Lists, Stacks, Queues & Hash Tables',
      'Tree Structures: Binary Search Trees, AVL, Red-Black Trees',
      'Graph Traversals: DFS & BFS, Dijkstra\'s Algorithm',
      'Dynamic Programming & Greedy Algorithms',
      'Mock Coding Interview Prep'
    ]
  },
  {
    title: 'Digital Marketing & Growth Hacking',
    description: 'Accelerate user acquisition. Learn SEO, SEM, content strategy, email marketing, Facebook Ads, and Google Analytics.',
    category: 'Marketing',
    instructor: 'Marcus Chen',
    price: 199,
    duration: '4 Weeks',
    level: 'Intermediate',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60',
    syllabus: [
      'SEO (Search Engine Optimization) Audits & Keyword Strategy',
      'Pay-Per-Click (PPC) Campaigns and Search Engine Marketing',
      'Content Marketing Systems & Copywriting Hooks',
      'Email Marketing Automation & Lead Funnels',
      'Google Analytics 4 (GA4) Conversion Mapping',
      'A/B Testing & Dynamic Growth Tactics'
    ]
  }
];

export const autoSeedIfEmpty = async () => {
  try {
    const courseCount = await Course.countDocuments();
    if (courseCount === 0) {
      console.log('Database empty! Auto-seeding default workshops and test accounts...');
      
      const admin = await User.create({
        name: 'Admin Instructor',
        email: 'admin@skillnest.com',
        password: 'adminpassword',
        role: 'admin'
      });

      const student = await User.create({
        name: 'John Student',
        email: 'student@skillnest.com',
        password: 'studentpassword',
        role: 'student'
      });

      const seededCourses = await Course.insertMany(defaultCourses);
      
      await Enrollment.create({
        student: student._id,
        course: seededCourses[0]._id
      });

      console.log('Auto-seeding complete! Pre-populated courses, student, and admin user.');
    }
  } catch (error) {
    console.error('Auto-seed error:', error.message);
  }
};
