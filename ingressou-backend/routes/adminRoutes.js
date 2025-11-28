// routes/adminRoutes.js

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Rota GET /api/admin/dashboard
// Protegida: Só admin logado pode ver
router.get('/dashboard', 
  authMiddleware.verifyToken, 
  adminMiddleware.isAdmin, 
  adminController.getDashboardStats
);

module.exports = router;