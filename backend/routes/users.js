const express = require('express');
const { auth } = require('../middleware/auth');
const { adminAuth } = require('../middleware/auth');
const { getAllUsers, addMemberToProject } = require('../controllers/userController');
const router = express.Router();

router.get('/', auth, adminAuth, getAllUsers);           // ✅ Admin: List users
router.post('/add-member', auth, addMemberToProject);    // ✅ Admin: Add to project

module.exports = router;