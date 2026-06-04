const mongoose = require('mongoose');
require('dotenv').config({ path: 'backend/.env' });

async function check() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to DB');
  
  const User = mongoose.model('User', new mongoose.Schema({ name: String, role: String, is_active: Boolean }));
  const Attendance = mongoose.model('Attendance', new mongoose.Schema({ user_id: mongoose.Schema.Types.ObjectId, date: String, status: String }));
  const Salary = mongoose.model('Salary', new mongoose.Schema({ user_id: mongoose.Schema.Types.ObjectId, month: String }));

  const employees = await User.find({ role: { $ne: 'admin' }, is_active: true });
  console.log(`Found ${employees.length} employees`);
  
  for (const emp of employees) {
    console.log(`\nChecking Employee: ${emp.name} (${emp._id})`);
    const attendance = await Attendance.find({ user_id: emp._id });
    console.log(`Total attendance records: ${attendance.length}`);
    if (attendance.length > 0) {
      console.log('Sample record date format:', attendance[0].date);
    }
    
    // Test the specific query used in salaryController
    const month = '2026-04';
    const filtered = await Attendance.find({ 
      user_id: emp._id, 
      date: { $regex: new RegExp(`^${month}`) } 
    });
    console.log(`Filtered for ${month}: ${filtered.length} records`);
  }

  process.exit();
}

check();
