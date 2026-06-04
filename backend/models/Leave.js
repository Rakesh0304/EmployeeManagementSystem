const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  leave_type: { 
    type: String, 
    enum: ['casual', 'government_holiday', 'other'], 
    required: true 
  },
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true },
  reason: String,
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  },
  approved_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Leave', leaveSchema);
