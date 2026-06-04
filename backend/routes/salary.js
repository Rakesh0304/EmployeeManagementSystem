const express = require('express');
const router = express.Router();
const salaryController = require('../controllers/salaryController');
const { verifyToken, authorize } = require('../middleware/auth');

router.post('/calculate', verifyToken, authorize('admin'), salaryController.calculateSalary);
router.get('/', verifyToken, salaryController.getSalary);
router.get('/my', verifyToken, salaryController.getMySalary);
router.get('/payslip/:id', verifyToken, salaryController.downloadPayslip);

module.exports = router;
