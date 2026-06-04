const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

const MAIN = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/employee_management';
    await mongoose.connect(uri);
    console.log(`Connected to MongoDB: ${uri}`);

    const newPassword = process.argv[2] || 'password123';
    const email = process.argv[3] || 'admin@company.com';

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const admin = await User.findOneAndUpdate(
      { email, role: 'admin' },
      { password: hashedPassword },
      { returnDocument: 'after' }
    );

    if (!admin) {
      console.error('Admin user not found. Check the email or admin account.');
      process.exit(1);
    }

    console.log(`Admin password updated for ${admin.email}`);
    console.log(`New password: ${newPassword}`);
    process.exit(0);
  } catch (error) {
    console.error('Failed to update admin password:', error.message);
    process.exit(1);
  }
};

MAIN();
