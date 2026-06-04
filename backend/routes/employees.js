const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const { verifyToken, authorize } = require('../middleware/auth');

router.get('/stats', verifyToken, authorize('admin', 'manager'), employeeController.getDashboardStats);
router.get('/', verifyToken, authorize('admin', 'manager'), employeeController.getAllEmployees);
router.get('/:id', verifyToken, authorize('admin', 'manager'), employeeController.getEmployeeById);
router.post('/', verifyToken, authorize('admin'), employeeController.createEmployee);
router.put('/:id', verifyToken, authorize('admin'), employeeController.updateEmployee);
router.delete('/:id', verifyToken, authorize('admin'), employeeController.deleteEmployee);

module.exports = router;
