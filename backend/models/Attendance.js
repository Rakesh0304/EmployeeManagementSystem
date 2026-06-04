const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true }, // Format: YYYY-MM-DD
  login_time: String,
  logout_time: String,
  status: { 
    type: String, 
    enum: ['present', 'late', 'half_day', 'absent', 'lop', 'leave', 'holiday', 'weekend'], 
    default: 'present' 
  },
  total_hours: { type: Number, default: 0 },
  remarks: String
}, { timestamps: true });

// Ensure unique attendance per user per day
attendanceSchema.index({ user_id: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
