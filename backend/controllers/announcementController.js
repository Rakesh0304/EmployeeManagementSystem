const Announcement = require('../models/Announcement');
const SaturdaySchedule = require('../models/SaturdaySchedule');
const User = require('../models/User');
const { notifyEmployeesOfAnnouncement } = require('../utils/emailService');

const getAllAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find({ is_active: true }).populate('created_by', 'name').sort({ createdAt: -1 });
    const mapped = announcements.map(a => ({
      ...a._doc,
      created_by_name: a.created_by?.name
    }));
    res.json(mapped);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createAnnouncement = async (req, res) => {
  try {
    const { title, message } = req.body;
    const announcement = new Announcement({
      title,
      message,
      created_by: req.user.id
    });
    await announcement.save();

    const admin = await User.findById(req.user.id).select('name');
    const emailResult = await notifyEmployeesOfAnnouncement({
      title,
      message,
      createdByName: admin?.name || 'Admin'
    });

    res.status(201).json({
      message: 'Announcement created successfully',
      emails: emailResult
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteAnnouncement = async (req, res) => {
  try {
    await Announcement.findByIdAndUpdate(req.params.id, { is_active: false });
    res.json({ message: 'Announcement deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSaturdaySchedule = async (req, res) => {
  try {
    const schedule = await SaturdaySchedule.find().sort({ date: 1 });
    res.json(schedule);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const setSaturdaySchedule = async (req, res) => {
  try {
    const { date, is_working } = req.body;
    await SaturdaySchedule.findOneAndUpdate(
      { date },
      { is_working, declared_by: req.user.id },
      { upsert: true, new: true }
    );
    res.json({ message: 'Saturday schedule updated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllAnnouncements, createAnnouncement, deleteAnnouncement, getSaturdaySchedule, setSaturdaySchedule };
