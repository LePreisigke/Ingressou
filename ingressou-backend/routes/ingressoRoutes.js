// routes/ingressoRoutes.js

const express = require('express');
const router = express.Router();
const ingressoController = require('../controllers/ingressoController');
const authMiddleware = require('../middleware/authMiddleware');

// Define a rota para criar um ingresso (comprar)
// Ela é protegida pelo 'verifyToken'
router.post('/', authMiddleware.verifyToken, ingressoController.create);

// Rota para LISTAR os ingressos do usuário
// GET /api/ingressos/meus-ingressos
router.get(
  '/meus-ingressos', 
  authMiddleware.verifyToken, 
  ingressoController.listarMeusIngressos
);

module.exports = router;