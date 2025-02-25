const express = require('express');
const {register, login, getMe, logout} = require('../controllers/authController');
const {protect} = require('../middleware/auth');
// console.log('Auth routes loaded');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', protect, logout)
router.get('/me', protect, getMe);

module.exports = router;