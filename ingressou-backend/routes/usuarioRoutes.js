// routes/usuarioRoutes.js

const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Todas as rotas aqui são exclusivas para ADMIN
// Aplicamos os middlewares em todas as rotas de uma vez:
router.use(authMiddleware.verifyToken, adminMiddleware.isAdmin);

router.get('/', usuarioController.listarTodos);
router.delete('/:id', usuarioController.delete);
router.put('/:id/toggle-admin', usuarioController.toggleAdmin);

module.exports = router;