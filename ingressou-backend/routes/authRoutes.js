// routes/authRoutes.js

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Rota para POST /api/auth/registrar
router.post('/registrar', authController.registrar);

// Rota para POST /api/auth/login
router.post('/login', authController.login);

module.exports = router;