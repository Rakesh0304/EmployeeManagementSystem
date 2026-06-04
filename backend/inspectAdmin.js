const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

(async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/employee_management';
    await mongoose.connect(uri);
    const admins = await User.find({ role: 'admin' }).select('email password is_active role').lean();
    console.log(JSON.stringify(admins, null, 2));
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
