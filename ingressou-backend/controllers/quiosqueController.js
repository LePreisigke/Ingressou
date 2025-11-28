// controllers/quiosqueController.js

const db = require('../models');
const Quiosque = db.Quiosque;
const Estadio = db.Estadio;

// --- FUNÇÃO 1: Listar Todos os Quiosques (Atualizada) ---
// Rota: GET /api/quiosques
exports.listarTodos = async (req, res) => {
  try {
    // 1. Pega o filtro da URL (se existir)
    const { estadio } = req.query;

    // 2. Prepara a opção de 'include' para o Estádio
    let includeOptions = [{
      model: Estadio,
      as: 'estadio',
      attributes: ['nome'] // Só precisamos do nome
    }];

    // 3. Adiciona o filtro (WHERE) se o slug do estádio foi passado
    if (estadio) {
      includeOptions[0].where = { slug: estadio };
    }

    // 4. Busca no banco
    const quiosques = await Quiosque.findAll({
      // Pede os campos do banco e já renomeia (alias) para o frontend
      attributes: [
        ['id_quiosque', 'id'],
        ['nome_quiosque', 'name'],
        'slogan',
        'category',
        ['localizacao', 'location'], // Renomeia localizacao -> location
        ['logo_url', 'logo'],
        ['menu_link', 'menuLink'],
        'phone',
        'email'
      ],
      include: includeOptions,
      raw: true, // Retorna JSON puro, mais limpo
      nest: true  // Agrupa o 'estadio' em um objeto
    });

    // 5. Formata o campo final 'stadiumShort'
    const response = quiosques.map(quiosque => {
      return {
        ...quiosque,
        stadiumShort: quiosque.estadio ? quiosque.estadio.nome : 'N/A'
      };
    });

    // 6. Envia a resposta
    res.status(200).json(response);

  } catch (error) {
    console.error('Erro ao buscar quiosques:', error);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};

// ... (código existente: listarTodos) ...

// --- FUNÇÃO 2: Criar Quiosque (Admin) ---
// Rota: POST /api/quiosques
exports.create = async (req, res) => {
  try {
    const { nome_quiosque, localizacao, id_estadio, slogan, category, logo_url, menu_link, phone, email } = req.body;

    if (!nome_quiosque || !localizacao || !id_estadio) {
      return res.status(400).json({ message: 'Campos obrigatórios faltando.' });
    }

    const novoQuiosque = await Quiosque.create({
      nome_quiosque, localizacao, id_estadio, slogan, category, logo_url, menu_link, phone, email
    });

    res.status(201).json({ message: 'Quiosque criado com sucesso!', quiosque: novoQuiosque });
  } catch (error) {
    console.error('Erro ao criar quiosque:', error);
    res.status(500).json({ message: 'Erro interno ao criar quiosque.' });
  }
};

// --- FUNÇÃO 3: Atualizar Quiosque (Admin) ---
// Rota: PUT /api/quiosques/:id
exports.update = async (req, res) => {
  try {
    const { id } = req.params; // Lembre-se: no banco é id_quiosque, mas o sequelize mapreia pelo ID da rota
    const dados = req.body;

    const quiosque = await Quiosque.findByPk(id);
    if (!quiosque) {
      return res.status(404).json({ message: 'Quiosque não encontrado.' });
    }

    await quiosque.update(dados);
    res.status(200).json({ message: 'Quiosque atualizado com sucesso!', quiosque });
  } catch (error) {
    console.error('Erro ao atualizar quiosque:', error);
    res.status(500).json({ message: 'Erro interno ao atualizar quiosque.' });
  }
};

// --- FUNÇÃO 4: Deletar Quiosque (Admin) ---
// Rota: DELETE /api/quiosques/:id
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const quiosque = await Quiosque.findByPk(id);

    if (!quiosque) {
      return res.status(404).json({ message: 'Quiosque não encontrado.' });
    }

    await quiosque.destroy();
    res.status(200).json({ message: 'Quiosque removido com sucesso.' });
  } catch (error) {
    console.error('Erro ao deletar quiosque:', error);
    res.status(500).json({ message: 'Erro interno ao deletar quiosque.' });
  }
};