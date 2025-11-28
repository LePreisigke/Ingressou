const express = require('express');
const router = express.Router();
const estadioController = require('../controllers/estadioController');

// Importa os middlewares de segurança
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// --- ROTAS PÚBLICAS (Qualquer um vê) ---
router.get('/', estadioController.listarTodos);
router.get('/:slug', estadioController.buscarPorSlug);

// --- ROTAS DE ADMIN (Só o chefe acessa) ---
// O usuário precisa estar logado (verifyToken) E ser admin (isAdmin)

// Criar
router.post('/', 
  authMiddleware.verifyToken, 
  adminMiddleware.isAdmin, 
  estadioController.create
);

// Atualizar (pelo ID)
router.put('/:id', 
  authMiddleware.verifyToken, 
  adminMiddleware.isAdmin, 
  estadioController.update
);

// Deletar (pelo ID)
router.delete('/:id', 
  authMiddleware.verifyToken, 
  adminMiddleware.isAdmin, 
  estadioController.delete
);

module.exports = router;