const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

async function check() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    const count = await User.countDocuments();
    console.log('Total Users:', count);
    
    const users = await User.find({}, 'name email role');
    console.log('Users found (first 5):', users.slice(0, 5));
    
    db.users.updateOne(
      { role: 'admin' },
      { $set: { password: '<bcrypt-hash-here>' } }
    );
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
}

check();
