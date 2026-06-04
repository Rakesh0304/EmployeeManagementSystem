const express = require('express');
const router = express.Router();
const leaveController = require('../controllers/leaveController');
const { verifyToken, authorize } = require('../middleware/auth');

router.post('/', verifyToken, leaveController.applyLeave);
router.get('/my', verifyToken, leaveController.getMyLeaves);
router.get('/all', verifyToken, authorize('admin', 'manager'), leaveController.getAllLeaves);
router.put('/:id/status', verifyToken, authorize('admin', 'manager'), leaveController.updateLeaveStatus);

module.exports = router;
