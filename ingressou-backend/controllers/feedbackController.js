// controllers/feedbackController.js

const db = require('../models');
const Feedback = db.Feedback;

// --- FUNÇÃO 1: Criar novo Feedback ---
// Rota: POST /api/feedback
exports.create = async (req, res) => {
  try {
    // 1. Pega os dados do body (enviados pelo frontend)
    const { id_jogo, nota, comentario } = req.body;

    // 2. Pega o ID do usuário (do token verificado pelo middleware)
    const id_usuario = req.user.id_usuario;

    // 3. Validação simples
    if (!id_jogo || !nota) {
      return res.status(400).json({ message: 'Campos "id_jogo" e "nota" são obrigatórios.' });
    }

    // 4. Cria o feedback no banco
    const novoFeedback = await Feedback.create({
      id_usuario,
      id_jogo,
      nota,
      comentario
      // 'createdAt' e 'updatedAt' são automáticos
    });

    // 5. Retorna sucesso
    res.status(201).json({
      message: 'Feedback enviado com sucesso!',
      feedback: novoFeedback
    });

  } catch (error) {
    console.error('Erro ao salvar feedback:', error);
    // Trata erros de FK (ex: id_jogo não existe)
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({ message: 'Erro: O jogo ou usuário não existe.' });
    }
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};