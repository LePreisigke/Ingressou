const express = require('express');
const router = express.Router();
const jogoController = require('../controllers/jogoController');

// Importa middlewares de segurança
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Rotas Públicas
router.get('/', jogoController.listarTodos);
router.get('/:id', jogoController.buscarPorId);

// Rotas de Admin (Protegidas)
router.post('/', authMiddleware.verifyToken, adminMiddleware.isAdmin, jogoController.create);
router.put('/:id', authMiddleware.verifyToken, adminMiddleware.isAdmin, jogoController.update);
router.delete('/:id', authMiddleware.verifyToken, adminMiddleware.isAdmin, jogoController.delete);

module.exports = router;