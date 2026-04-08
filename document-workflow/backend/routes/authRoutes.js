const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/userController');

// Match frontend calls: /api/auth/register and /api/auth/login
router.post('/register', register);
router.post('/login', login);

module.exports = router;