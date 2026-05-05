const express = require('express');
const { auth } = require('../middleware/auth');
const { signup, login, getMe, logout } = require('../controllers/authController');
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', auth, getMe);
router.post('/logout', auth, logout);

module.exports = router;