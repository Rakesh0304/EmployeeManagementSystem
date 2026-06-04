const mongoose = require('mongoose');
require('dotenv').config({ path: 'backend/.env' });

async function cleanup() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');

    const Attendance = mongoose.model('Attendance', new mongoose.Schema({ user_id: mongoose.Schema.Types.Mixed, date: String }));
    const Salary = mongoose.model('Salary', new mongoose.Schema({ user_id: mongoose.Schema.Types.Mixed, month: String }));

    // Cleanup Attendance
    const allAttendance = await Attendance.find({});
    console.log(`Checking ${allAttendance.length} attendance records...`);
    let attCount = 0;
    for (const att of allAttendance) {
      if (typeof att.user_id === 'string' && mongoose.Types.ObjectId.isValid(att.user_id)) {
        att.user_id = new mongoose.Types.ObjectId(att.user_id);
        await att.save();
        attCount++;
      }
    }
    console.log(`Updated ${attCount} attendance records to ObjectId.`);

    // Cleanup Salary
    const allSalary = await Salary.find({});
    console.log(`Checking ${allSalary.length} salary records...`);
    let salCount = 0;
    for (const sal of allSalary) {
      if (typeof sal.user_id === 'string' && mongoose.Types.ObjectId.isValid(sal.user_id)) {
        sal.user_id = new mongoose.Types.ObjectId(sal.user_id);
        await sal.save();
        salCount++;
      }
    }
    console.log(`Updated ${salCount} salary records to ObjectId.`);

    console.log('Cleanup complete!');
  } catch (err) {
    console.error('Error during cleanup:', err);
  } finally {
    process.exit();
  }
}

cleanup();
