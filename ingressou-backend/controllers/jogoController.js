// controllers/jogoController.js

const db = require('../models');
const { Op } = require('sequelize');
const Jogo = db.Jogo;
const Estadio = db.Estadio;
const Setor = db.Setor;

// --- FUNÇÃO 1: Listar Todos os Jogos ---
// (Para a tela Home.jsx)
// Rota: GET /api/jogos
exports.listarTodos = async (req, res) => {
  try {
    // 1. Pega os filtros da URL
    const { estadio, q } = req.query; // 'q' é o termo de pesquisa

    // 2. Prepara o 'where' principal (para o Jogo)
    const whereClause = {};
    if (q) {
      // Se 'q' existir, procura em time_casa, time_visitante OU campeonato
      whereClause[Op.or] = [
        { time_casa: { [Op.iLike]: `%${q}%` } },     // 'iLike' é case-insensitive
        { time_visitante: { [Op.iLike]: `%${q}%` } },
        { campeonato: { [Op.iLike]: `%${q}%` } }
      ];
    }

    // 3. Prepara o 'include' (para o Estádio)
    let includeOptions = [{
      model: Estadio,
      as: 'estadio',
      attributes: ['nome']
    }];

    // 4. Adiciona o filtro de estádio (se existir)
    if (estadio) {
      includeOptions[0].where = { slug: estadio };
    }

    // 5. Monta a query final
    const jogos = await Jogo.findAll({
      where: whereClause, // <-- ADICIONADO
      attributes: [
        ['id_jogo', 'id'], 'time_casa', 'time_visitante', 'data_jogo',
        'horario', ['campeonato', 'category'], ['rodada', 'round']
      ],
      include: includeOptions,
      order: [['data_jogo', 'ASC'], ['horario', 'ASC']]
    });

    res.status(200).json(jogos);

  } catch (error) {
    console.error('Erro ao buscar jogos:', error);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};

// --- FUNÇÃO 2: Buscar Um Jogo pelo ID ---
// Rota: GET /api/jogos/:id
exports.buscarPorId = async (req, res) => {
  try {
    // 1. Pega o 'id' da URL
    const { id } = req.params;

    // 2. Busca o jogo específico
    const jogo = await Jogo.findOne({ 
      where: { id_jogo: id },
      // Inclui os dados completos do estádio E os setores daquele estádio
      include: [
        {
          model: Estadio,
          as: 'estadio',
          // Traz todos os dados do estádio
          include: [
            {
                model: Setor,
                as: 'setores' // Traz os setores associados ao estádio
            }
          ]
        }
      ]
    });

    // 3. Verifica se o jogo foi encontrado
    if (!jogo) {
      return res.status(404).json({ message: 'Jogo não encontrado.' });
    }

    // 4. Retorna o jogo encontrado
    res.status(200).json(jogo);

  } catch (error) {
    console.error('Erro ao buscar jogo:', error);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};

// ... (código existente: listarTodos, buscarPorId) ...

// --- FUNÇÃO 3: Criar Jogo (Admin) ---
// Rota: POST /api/jogos
exports.create = async (req, res) => {
  try {
    const { time_casa, time_visitante, data_jogo, horario, campeonato, rodada, id_estadio } = req.body;

    if (!time_casa || !time_visitante || !data_jogo || !horario || !id_estadio) {
      return res.status(400).json({ message: 'Campos obrigatórios faltando.' });
    }

    const novoJogo = await Jogo.create({
      time_casa, time_visitante, data_jogo, horario, campeonato, rodada, id_estadio
    });

    res.status(201).json({ message: 'Jogo criado com sucesso!', jogo: novoJogo });
  } catch (error) {
    console.error('Erro ao criar jogo:', error);
    res.status(500).json({ message: 'Erro interno ao criar jogo.' });
  }
};

// --- FUNÇÃO 4: Atualizar Jogo (Admin) ---
// Rota: PUT /api/jogos/:id
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const dados = req.body;

    const jogo = await Jogo.findByPk(id);
    if (!jogo) {
      return res.status(404).json({ message: 'Jogo não encontrado.' });
    }

    await jogo.update(dados);
    res.status(200).json({ message: 'Jogo atualizado com sucesso!', jogo });
  } catch (error) {
    console.error('Erro ao atualizar jogo:', error);
    res.status(500).json({ message: 'Erro interno ao atualizar jogo.' });
  }
};

// --- FUNÇÃO 5: Deletar Jogo (Admin) ---
// Rota: DELETE /api/jogos/:id
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const jogo = await Jogo.findByPk(id);

    if (!jogo) {
      return res.status(404).json({ message: 'Jogo não encontrado.' });
    }

    await jogo.destroy();
    res.status(200).json({ message: 'Jogo removido com sucesso.' });
  } catch (error) {
    console.error('Erro ao deletar jogo:', error);
    res.status(500).json({ message: 'Erro interno ao deletar jogo.' });
  }
};