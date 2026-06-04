const mongoose = require('mongoose');

const saturdayScheduleSchema = new mongoose.Schema({
  date: { type: String, required: true, unique: true }, // Format: YYYY-MM-DD
  is_working: { type: Boolean, required: true, default: false },
  declared_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('SaturdaySchedule', saturdayScheduleSchema);
