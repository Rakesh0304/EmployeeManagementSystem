const mongoose = require('mongoose');
const User = require('./backend/models/User');
const Attendance = require('./backend/models/Attendance');
const Leave = require('./backend/models/Leave');

async function debugData() {
  try {
    await mongoose.connect('mongodb://localhost:27017/employee_management');
    
    const users = await User.find({});
    console.log('--- USERS ---');
    users.forEach(u => console.log(`Name: ${u.name}, Role: "${u.role}"`));

    const today = new Date().toISOString().split('T')[0];
    console.log('\n--- ATTENDANCE ---');
    console.log('Searching for date:', today);
    const attendance = await Attendance.find({ date: today });
    console.log('Today\'s records count:', attendance.length);
    attendance.forEach(a => console.log(`UserID: ${a.user_id}, Status: ${a.status}`));

    console.log('\n--- LEAVES ---');
    const leaves = await Leave.find({ status: 'pending' });
    console.log('Pending leaves count:', leaves.length);

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

debugData();
