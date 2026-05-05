const express = require('express');
const { auth } = require('../middleware/auth');
const { getProjects, createProject, addMember, removeMember } = require('../controllers/projectController');
const router = express.Router();

router.get('/', auth, getProjects);
router.post('/', auth, createProject);
router.post('/members/add', auth, addMember);     // ✅ NEW
router.post('/members/remove', auth, removeMember); // ✅ NEW

module.exports = router;