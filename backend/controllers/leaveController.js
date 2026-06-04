const Leave = require('../models/Leave');

const applyLeave = async (req, res) => {
  try {
    const { leave_type, start_date, end_date, reason } = req.body;
    const leave = new Leave({
      user_id: req.user.id,
      leave_type,
      start_date,
      end_date,
      reason
    });
    await leave.save();
    res.status(201).json({ message: 'Leave applied successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ user_id: req.user.id }).populate('approved_by', 'name').sort({ createdAt: -1 });
    const mapped = leaves.map(l => ({
      ...l._doc,
      approved_by_name: l.approved_by?.name
    }));
    res.json(mapped);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllLeaves = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const leaves = await Leave.find(filter).populate('user_id', 'name').populate('approved_by', 'name').sort({ createdAt: -1 });
    const mapped = leaves.map(l => ({
      ...l._doc,
      name: l.user_id?.name,
      approved_by_name: l.approved_by?.name
    }));
    res.json(mapped);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateLeaveStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const leave = await Leave.findByIdAndUpdate(req.params.id, { 
      status, 
      approved_by: req.user.id 
    }, { new: true });
    
    if (!leave) return res.status(404).json({ message: 'Leave record not found' });
    res.json({ message: `Leave ${status} successfully` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { applyLeave, getMyLeaves, getAllLeaves, updateLeaveStatus };
