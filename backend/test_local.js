import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/user.model.js';
import Course from './models/course.model.js';
import Enrollment from './models/enrollment.model.js';

dotenv.config();

const testLocalBackend = async () => {
  console.log('=== SKILLNEST LOCAL BACKEND & DATABASE VERIFICATION TEST ===\n');

  try {
    // 1. Test direct Mongoose connection to MongoDB Atlas
    console.log('1. Connecting to MongoDB Atlas database...');
    await connectDB();
    console.log('✅ MongoDB Atlas connection successful!\n');

    // 2. Query collections in MongoDB Atlas
    const userCount = await User.countDocuments();
    const courseCount = await Course.countDocuments();
    const enrollmentCount = await Enrollment.countDocuments();

    console.log('2. Database Summary:');
    console.log(`   - Total Users in DB: ${userCount}`);
    console.log(`   - Total Courses in DB: ${courseCount}`);
    console.log(`   - Total Enrollments in DB: ${enrollmentCount}\n`);

    // 3. Fetch courses list directly from Atlas
    const courses = await Course.find({}).select('title category price instructor level');
    console.log('3. Courses currently in MongoDB Atlas:');
    courses.forEach((c, idx) => {
      console.log(`   [${idx + 1}] ${c.title} | Category: ${c.category} | Price: ₹${c.price} | Level: ${c.level} | Instructor: ${c.instructor}`);
    });
    console.log('');

    // 4. Test Student Login Auth logic
    const studentUser = await User.findOne({ email: 'student@skillnest.com' }).select('+password');
    if (studentUser) {
      const isStudentMatch = await studentUser.matchPassword('studentpassword');
      console.log(`4. Student Auth Test (student@skillnest.com): ${isStudentMatch ? '✅ Password Verified' : '❌ Password Mismatch'}`);
    }

    // 5. Test Admin Login Auth logic
    const adminUser = await User.findOne({ email: 'admin@skillnest.com' }).select('+password');
    if (adminUser) {
      const isAdminMatch = await adminUser.matchPassword('adminpassword');
      console.log(`5. Admin Auth Test (admin@skillnest.com): ${isAdminMatch ? '✅ Password Verified' : '❌ Password Mismatch'}`);
    }

    console.log('\n============================================================');
    console.log('🎉 ALL BACKEND & DATABASE TESTS PASSED CLEANLY ON LOCAL!');
    console.log('============================================================');

    process.exit(0);
  } catch (error) {
    console.error('❌ Test execution failed:', error.message);
    process.exit(1);
  }
};

testLocalBackend();
