const mongoose = require('mongoose');
require('dotenv').config();

async function check() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');
    
    // Define models inline
    const User = mongoose.model('User', new mongoose.Schema({ name: String, role: String, is_active: Boolean }));
    const Attendance = mongoose.model('Attendance', new mongoose.Schema({ user_id: mongoose.Schema.Types.ObjectId, date: String, status: String }));
    const Salary = mongoose.model('Salary', new mongoose.Schema({ user_id: mongoose.Schema.Types.ObjectId, month: String, net_salary: Number, present_days: Number }));

    const employees = await User.find({ role: { $ne: 'admin' }, is_active: true });
    console.log(`Found ${employees.length} active employees`);
    
    for (const emp of employees) {
      console.log(`\n--- ${emp.name} (${emp._id}) ---`);
      
      const attendance = await Attendance.find({ user_id: emp._id });
      console.log(`Total attendance records: ${attendance.length}`);
      if (attendance.length > 0) {
        attendance.forEach(a => console.log(`  - ${a.date}: ${a.status}`));
      }
      
      const salaries = await Salary.find({ user_id: emp._id });
      console.log(`Salary records: ${salaries.length}`);
      salaries.forEach(s => console.log(`  - ${s.month}: Present=${s.present_days}, Net=${s.net_salary}`));
      
      const month = '2026-04';
      const filtered = await Attendance.find({ 
        user_id: emp._id, 
        date: { $regex: new RegExp(`^${month}`) } 
      });
      console.log(`Query Test (^${month}): Found ${filtered.length} records`);
    }

  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
}

check();
