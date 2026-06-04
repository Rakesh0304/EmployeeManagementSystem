const Attendance = require('../models/Attendance');


const clockIn = async (req, res) => {
  try {
    const userId = req.user.id;
    const simTime = req.headers['x-simulated-time'];
    const now = simTime ? new Date(simTime) : new Date();
    const date = now.toISOString().split('T')[0];
    const loginTime = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

    // Determine status
    let status = 'present';
    const [hours, minutes] = loginTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes;

    if (totalMinutes >= 780) { // 1:00 PM or later
      status = 'lop';
    } else if (totalMinutes >= 750) { // 12:30 PM - 12:59 PM
      status = 'half_day';
    } else if (totalMinutes > 600) { // After 10:00 AM
      status = 'late';
    }

    const attendance = new Attendance({
      user_id: userId,
      date,
      login_time: loginTime,
      status
    });

    await attendance.save();
    res.json({ message: `Clocked in successfully at ${loginTime}. Status: ${status}` });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Already clocked in for today' });
    }
    res.status(500).json({ message: error.message });
  }
};

const clockOut = async (req, res) => {
  try {
    const userId = req.user.id;
    const simTime = req.headers['x-simulated-time'];
    const now = simTime ? new Date(simTime) : new Date();
    const date = now.toISOString().split('T')[0];
    const logoutTime = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

    const attendance = await Attendance.findOne({ user_id: userId, date });
    if (!attendance) return res.status(404).json({ message: 'No clock-in record found for today' });

    if (attendance.logout_time) return res.status(400).json({ message: 'Already clocked out' });

    // Calculate hours
    const [inH, inM] = attendance.login_time.split(':').map(Number);
    const [outH, outM] = logoutTime.split(':').map(Number);
    const diff = (outH * 60 + outM) - (inH * 60 + inM);
    const totalHours = parseFloat((diff / 60).toFixed(2));

    attendance.logout_time = logoutTime;
    attendance.total_hours = totalHours;
    await attendance.save();

    res.json({ message: `Clocked out successfully at ${logoutTime}. Total hours: ${totalHours}` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTodayStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const simTime = req.headers['x-simulated-time'];
    const now = simTime ? new Date(simTime) : new Date();
    const date = now.toISOString().split('T')[0];
    const attendance = await Attendance.findOne({ user_id: userId, date });
    
    res.json({
      clockedIn: !!attendance,
      clockedOut: !!(attendance && attendance.logout_time),
      status: attendance ? attendance.status : null,
      login_time: attendance ? attendance.login_time : null,
      logout_time: attendance ? attendance.logout_time : null,
      total_hours: attendance ? attendance.total_hours : 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyAttendance = async (req, res) => {
  try {
    const { month, year } = req.query;
    const regex = new RegExp(`^${year}-${String(month).padStart(2, '0')}`);
    const history = await Attendance.find({ user_id: req.user.id, date: { $regex: regex } }).sort({ date: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllAttendance = async (req, res) => {
  try {
    const { date } = req.query;
    const records = await Attendance.find({ date }).populate('user_id', 'name department');
    const mapped = records.map(r => ({
      ...r._doc,
      name: r.user_id?.name,
      department: r.user_id?.department
    }));
    res.json(mapped);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const manualClockIn = async (req, res) => {
  try {
    const { user_id, date, login_time, logout_time, status, remarks } = req.body;
    let totalHours = 0;
    if (login_time && logout_time) {
      const [inH, inM] = login_time.split(':').map(Number);
      const [outH, outM] = logout_time.split(':').map(Number);
      totalHours = parseFloat((((outH * 60 + outM) - (inH * 60 + inM)) / 60).toFixed(2));
    }

    const attendance = await Attendance.findOneAndUpdate(
      { user_id, date },
      { login_time, logout_time, status, total_hours: totalHours, remarks },
      { upsert: true, new: true }
    );
    res.json({ message: 'Attendance updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { clockIn, clockOut, getTodayStatus, getMyAttendance, getAllAttendance, manualClockIn };
