const mongoose = require('mongoose');

const salarySchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  month: { type: String, required: true }, // Format: YYYY-MM
  basic_salary: { type: Number, required: true },
  working_days: { type: Number, default: 0 },
  present_days: { type: Number, default: 0 },
  late_days: { type: Number, default: 0 },
  half_days: { type: Number, default: 0 },
  absent_days: { type: Number, default: 0 },
  lop_days: { type: Number, default: 0 },
  late_deduction: { type: Number, default: 0 },
  half_day_deduction: { type: Number, default: 0 },
  lop_deduction: { type: Number, default: 0 },
  total_deductions: { type: Number, default: 0 },
  net_salary: { type: Number, required: true },
  is_paid: { type: Boolean, default: false }
}, { timestamps: true });

salarySchema.index({ user_id: 1, month: 1 }, { unique: true });

module.exports = mongoose.model('Salary', salarySchema);
