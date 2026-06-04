const mongoose = require('mongoose');
const User = require('./backend/models/User');
const dbConfig = require('./backend/config/db');

async function checkUsers() {
    try {
        await mongoose.connect('mongodb://localhost:27017/ems_db'); // Assuming the DB name
        const employees = await User.countDocuments({ role: 'employee' });
        const managers = await User.countDocuments({ role: 'manager' });
        const all = await User.find({});
        console.log('Total Employees:', employees);
        console.log('Total Managers:', managers);
        console.log('All Users roles:', all.map(u => u.role));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkUsers();
