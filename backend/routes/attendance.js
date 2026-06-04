const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const { verifyToken, authorize } = require('../middleware/auth');

router.post('/clock-in', verifyToken, attendanceController.clockIn);
router.post('/clock-out', verifyToken, attendanceController.clockOut);
router.get('/today', verifyToken, attendanceController.getTodayStatus);
router.get('/my', verifyToken, attendanceController.getMyAttendance);
router.get('/all', verifyToken, authorize('admin', 'manager'), attendanceController.getAllAttendance);
router.post('/manual', verifyToken, authorize('admin', 'manager'), attendanceController.manualClockIn);

module.exports = router;
