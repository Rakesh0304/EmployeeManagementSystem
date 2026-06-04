const express = require('express');
const router = express.Router();
const announcementController = require('../controllers/announcementController');
const { verifyToken, authorize } = require('../middleware/auth');

router.post('/', verifyToken, authorize('admin'), announcementController.createAnnouncement);
router.get('/', verifyToken, announcementController.getAllAnnouncements);
router.delete('/:id', verifyToken, authorize('admin'), announcementController.deleteAnnouncement);
router.post('/saturday', verifyToken, authorize('admin'), announcementController.setSaturdaySchedule);
router.get('/saturday', verifyToken, announcementController.getSaturdaySchedule);

module.exports = router;
