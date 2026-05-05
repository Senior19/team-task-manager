const express = require('express');
const { auth } = require('../middleware/auth');
const { getDashboardTasks, createTask, updateTask } = require('../controllers/taskController');
const router = express.Router();

router.get('/dashboard', auth, getDashboardTasks);    // Dashboard stats + tasks
router.get('/stats', auth, getDashboardTasks);
router.get('/', auth, getDashboardTasks);
router.post('/', auth, createTask);                   // ✅ Create task
router.patch('/:id', auth, updateTask);               // ✅ Update task

module.exports = router;