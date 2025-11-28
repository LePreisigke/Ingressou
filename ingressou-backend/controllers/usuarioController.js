// controllers/usuarioController.js

const db = require('../models');
const Usuario = db.Usuario;

// --- FUNÇÃO 1: Listar Todos os Usuários ---
// Rota: GET /api/usuarios
exports.listarTodos = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      attributes: ['id_usuario', 'nome', 'email', 'is_admin', 'createdAt'] 
      // Não retornamos a senha!
    });

    // Formata para o frontend
    const response = usuarios.map(u => ({
      id: u.id_usuario,
      nome: u.nome,
      email: u.email,
      is_admin: u.is_admin,
      data_cadastro: u.createdAt
    }));

    res.status(200).json(response);
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};

// --- FUNÇÃO 2: Deletar Usuário ---
// Rota: DELETE /api/usuarios/:id
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Impede que o admin delete a si mesmo (segurança básica)
    if (Number(id) === req.user.id_usuario) {
      return res.status(400).json({ message: 'Você não pode deletar a si mesmo.' });
    }

    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    await usuario.destroy();
    res.status(200).json({ message: 'Usuário removido com sucesso.' });
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    res.status(500).json({ message: 'Erro interno ao deletar usuário.' });
  }
};

// --- FUNÇÃO 3: Tornar Admin (Toggle) ---
// Rota: PUT /api/usuarios/:id/toggle-admin
exports.toggleAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    if (Number(id) === req.user.id_usuario) {
      return res.status(400).json({ message: 'Você não pode alterar seu próprio status de admin.' });
    }

    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    // Inverte o status (se era true vira false, e vice-versa)
    usuario.is_admin = !usuario.is_admin;
    await usuario.save();

    res.status(200).json({ 
      message: `Usuário ${usuario.is_admin ? 'promovido a Admin' : 'rebaixado a Usuário'} com sucesso.`,
      is_admin: usuario.is_admin
    });

  } catch (error) {
    console.error('Erro ao alterar status:', error);
    res.status(500).json({ message: 'Erro interno.' });
  }
};