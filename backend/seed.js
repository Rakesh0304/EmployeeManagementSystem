const mongoose = require('mongoose');
const User = require('./models/User');
const connectDB = require('./config/db');
require('dotenv').config();

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    console.log('🗑️ Existing users cleared');

    // Admin
    const admin = new User({
      name: 'Admin User',
      email: 'admin@company.com',
      password: 'password123',
      role: 'admin',
      department: 'Management',
      designation: 'System Administrator'
    });
    await admin.save();
    console.log('👤 Admin created');

    // Manager
    const manager = new User({
      name: 'Manager User',
      email: 'manager@company.com',
      password: 'password123',
      role: 'manager',
      department: 'Engineering',
      designation: 'Engineering Manager'
    });
    await manager.save();
    console.log('👤 Manager created');

    // 23 Employees
    const firstNames = ['Amit', 'Priya', 'Rahul', 'Sonal', 'Vijay', 'Anjali', 'Deepak', 'Megha', 'Karan', 'Neha', 'Sanjay', 'Ritu', 'Arjun', 'Sneha', 'Vikram', 'Pooja', 'Rohan', 'Swati', 'Manish', 'Kavita', 'Aditya', 'Ishita', 'Varun'];
    const lastNames = ['Patel', 'Sharma', 'Verma', 'Singh', 'Gupta', 'Mehta', 'Reddy', 'Joshi', 'Chopra', 'Yadav', 'Malhotra', 'Bose', 'Nair', 'Deshmukh', 'Kulkarni', 'Pandey', 'Saxena', 'Mishra', 'Tiwari', 'Das', 'Roy', 'Sen', 'Grover'];

    for (let i = 0; i < 23; i++) {
      const emp = new User({
        name: `${firstNames[i]} ${lastNames[i]}`,
        email: `${firstNames[i].toLowerCase()}.${lastNames[i].toLowerCase()}@company.com`,
        password: 'password123',
        role: 'employee',
        department: i % 2 === 0 ? 'Engineering' : 'Support',
        designation: i % 2 === 0 ? 'Software Engineer' : 'Support Associate',
        basic_salary: 30000 + (i * 1000),
        date_of_joining: new Date(2023, i % 12, (i % 28) + 1)
      });
      await emp.save();
    }

    console.log('✅ Seed data created successfully (1 Admin, 1 Manager, 23 Employees)');
    process.exit();
  } catch (error) {
    console.error(`❌ Seeding failed: ${error.message}`);
    process.exit(1);
  }
};

seedData();
