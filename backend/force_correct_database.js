const mongoose = require('mongoose');
require('dotenv').config({ path: 'backend/.env' });

async function fullScrub() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');

    const Attendance = mongoose.model('Attendance', new mongoose.Schema({ user_id: mongoose.Schema.Types.Mixed, date: String, status: String, login_time: String, logout_time: String }));
    const Salary = mongoose.model('Salary', new mongoose.Schema({ user_id: mongoose.Schema.Types.Mixed, month: String }));

    // Aggressive Attendance Scrub
    const attendances = await Attendance.find({});
    console.log(`Scrubbing ${attendances.length} attendance records...`);
    let countAtt = 0;
    for (const att of attendances) {
      if (typeof att.user_id !== 'object') {
         console.log(`  Fixing UserID type for record on ${att.date}`);
         att.user_id = new mongoose.Types.ObjectId(att.user_id.toString());
         await att.save();
         countAtt++;
      }
    }
    console.log(`Aggressive scrub complete. ${countAtt} records fixed.`);

    // Aggressive Salary Scrub
    const salaries = await Salary.find({});
    console.log(`Scrubbing ${salaries.length} salary records...`);
    let countSal = 0;
    for (const sal of salaries) {
      if (typeof sal.user_id !== 'object') {
         console.log(`  Fixing UserID type for salary month ${sal.month}`);
         sal.user_id = new mongoose.Types.ObjectId(sal.user_id.toString());
         await sal.save();
         countSal++;
      }
    }
    console.log(`Salary scrub complete. ${countSal} records fixed.`);

    console.log('✅ Database is now 100% type-consistent.');
  } catch (err) {
    console.error('Scrub failed:', err);
  } finally {
    process.exit();
  }
}

fullScrub();
