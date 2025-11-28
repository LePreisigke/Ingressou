// controllers/ingressoController.js

const db = require('../models');
const Ingresso = db.Ingresso;
const Jogo = db.Jogo;         // <-- VERIFIQUE SE ADICIONOU ISSO
const Estadio = db.Estadio;   // <-- VERIFIQUE SE ADICIONOU ISSO
const Setor = db.Setor;     // <-- VERIFIQUE SE ADICIONOU ISSO

// --- FUNÇÃO 1: Criar novo Ingresso (Comprar) ---
// (Esta função você já tinha)
exports.create = async (req, res) => {
  try {
    const { id_jogo, id_setor } = req.body;
    const id_usuario = req.user.id_usuario;

    if (!id_jogo || !id_setor) {
      return res.status(400).json({ message: 'Campos "id_jogo" e "id_setor" são obrigatórios.' });
    }

    const qr_code = `INGRESSOU-${id_usuario}-${id_jogo}-${new Date().getTime()}`;
    const status_pagamento = true;

    const novoIngresso = await Ingresso.create({
      id_usuario,
      id_jogo,
      id_setor,
      qr_code,
      status_pagamento
    });

    res.status(201).json({
      message: 'Ingresso comprado com sucesso!',
      ingresso: novoIngresso
    });

  } catch (error) {
    console.error('Erro ao comprar ingresso:', error);
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({ message: 'Erro: O jogo ou setor não existe.' });
    }
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};


// --- FUNÇÃO 2: Listar Ingressos do Usuário ---
// (Esta é a função que estava faltando)
exports.listarMeusIngressos = async (req, res) => {
  try {
    const id_usuario = req.user.id_usuario;

    const ingressos = await Ingresso.findAll({
      where: { id_usuario: id_usuario },
      include: [
        {
          model: Jogo,
          as: 'jogo',
          attributes: ['time_casa', 'time_visitante', 'data_jogo', 'horario'],
          include: [{
            model: Estadio,
            as: 'estadio',
            attributes: ['nome'] 
          }]
        },
        {
          model: Setor,
          as: 'setor',
          attributes: ['nome_setor', 'preco']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json(ingressos);

  } catch (error) {
    console.error('Erro ao buscar meus ingressos:', error);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};