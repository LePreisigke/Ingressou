// routes/cardapioRoutes.js

const express = require('express');
const router = express.Router();
const cardapioController = require('../controllers/cardapioController');

// Define a rota pública para buscar um cardápio
// Rota: GET /api/cardapios/1 (onde 1 é o id_quiosque)
router.get('/:id_quiosque', cardapioController.buscarPorQuiosque);

module.exports = router;