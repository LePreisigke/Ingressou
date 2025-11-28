// routes/feedbackRoutes.js

const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
const authMiddleware = require('../middleware/authMiddleware');

// Define as rotas para feedback
// Rota para POST /api/feedback

// Veja como o middleware é adicionado ANTES do controller:
// 1. A requisição chega para /api/feedback
// 2. O authMiddleware.verifyToken é executado (o "porteiro")
// 3. Se o token for válido, ele chama o feedbackController.create
router.post('/', authMiddleware.verifyToken, feedbackController.create);

module.exports = router;