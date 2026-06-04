const mongoose = require('mongoose');
const User = require('./backend/models/User');

async function checkRoles() {
  try {
    await mongoose.connect('mongodb://localhost:27017/employee_management');
    const users = await User.find({});
    const roles = users.map(u => ({ name: u.name, role: u.role }));
    console.log(JSON.stringify(roles, null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkRoles();
