const express = require('express');
const router = express.Router();
const quiosqueController = require('../controllers/quiosqueController');

const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Rota Pública
router.get('/', quiosqueController.listarTodos);

// Rotas de Admin
router.post('/', authMiddleware.verifyToken, adminMiddleware.isAdmin, quiosqueController.create);
router.put('/:id', authMiddleware.verifyToken, adminMiddleware.isAdmin, quiosqueController.update);
router.delete('/:id', authMiddleware.verifyToken, adminMiddleware.isAdmin, quiosqueController.delete);

module.exports = router;