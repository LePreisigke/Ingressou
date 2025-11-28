// routes/perfilRoutes.js

const express = require('express');
const router = express.Router();
const perfilController = require('../controllers/perfilController');
const authMiddleware = require('../middleware/authMiddleware');

// Rota para GET /api/perfil
// (Protegida pelo 'verifyToken')
router.get('/', authMiddleware.verifyToken, perfilController.getPerfil);
// Rota para PUT /api/perfil 
// (Atualizar o perfil do usuário)
router.put('/', authMiddleware.verifyToken, perfilController.updatePerfil);

module.exports = router;