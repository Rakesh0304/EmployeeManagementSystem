const User = require('../models/User');
const Attendance = require('../models/Attendance');
const Leave = require('../models/Leave');

const getAllEmployees = async (req, res) => {
  try {
    const employees = await User.find({ role: { $ne: 'admin' } }).select('-password');
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    const totalEmployees = await User.countDocuments({ role: 'employee' });
    const totalManagers = await User.countDocuments({ role: 'manager' });
    const presentToday = await Attendance.countDocuments({ 
      date: today, 
      status: { $in: ['present', 'late'] } 
    });
    const pendingLeaves = await Leave.countDocuments({ status: 'pending' });
    
    const stats = {
      totalEmployees,
      totalManagers,
      presentToday, 
      pendingLeaves 
    };

    console.log('--- Dashboard Stats Calculated ---');
    console.log('Today:', today);
    console.log('Stats:', stats);
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createEmployee = async (req, res) => {
  try {
    const newEmployee = new User(req.body);
    await newEmployee.save();
    res.status(201).json({ message: 'Employee created successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Employee not found' });
    res.json({ message: 'Employee updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Employee not found' });
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getEmployeeById = async (req, res) => {
  try {
    const employee = await User.findById(req.params.id).select('-password');
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllEmployees, getEmployeeById, getDashboardStats, createEmployee, updateEmployee, deleteEmployee };
