const mongoose = require('mongoose');
require('dotenv').config({ path: 'backend/.env' });

async function check() {
  await mongoose.connect(process.env.MONGODB_URI);
  const User = mongoose.model('User', new mongoose.Schema({ name: String }));
  const Attendance = mongoose.model('Attendance', new mongoose.Schema({ user_id: mongoose.Schema.Types.ObjectId, date: String, status: String }));
  const Salary = mongoose.model('Salary', new mongoose.Schema({ user_id: mongoose.Schema.Types.ObjectId, month: String, present_days: Number, total_deductions: Number }));

  const emp = await User.findOne({ name: 'Amit Patel' });
  const att = await Attendance.find({ user_id: emp._id, date: /^2026-04/ });
  const sal = await Salary.findOne({ user_id: emp._id, month: '2026-04' });

  console.log('--- Amit Patel Data ---');
  console.log('Attendance Records Found:', att.length);
  att.forEach(a => console.log(`${a.date}: Status="${a.status}"`));
  
  if (sal) {
    console.log('\n--- Salary Record ---');
    console.log('Present Days:', sal.present_days);
    console.log('Deductions:', sal.total_deductions);
  }

  process.exit();
}
check();
