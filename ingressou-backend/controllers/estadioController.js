// controllers/estadioController.js

const db = require('../models');
const { Op } = require('sequelize');
const Estadio = db.Estadio;
const Setor = db.Setor;

// --- FUNÇÃO 1: Listar Todos os Estádios ---
// (Corrigida para enviar 'name' e 'description')
exports.listarTodos = async (req, res) => {
  try {
    const { q } = req.query; // Termo de pesquisa

    // 1. Prepara o filtro
    const whereClause = {};
    
    if (q) {
      // Busca no Nome OU Apelido OU Cidade
      whereClause[Op.or] = [
        { nome: { [Op.iLike]: `%${q}%` } },
        { apelido: { [Op.iLike]: `%${q}%` } },
        { cidade: { [Op.iLike]: `%${q}%` } }
      ];
    }

    const estadios = await Estadio.findAll({
      where: whereClause,
      attributes: [
        'id_estadio',
        'slug', 
        ['nome', 'name'],
        ['apelido', 'nickname'],
        ['descricao', 'description'],
        ['imagem_url', 'imageUrl'],
        'cidade', 
        'estado',
        'capacidade_total', 
        'mapa_detalhado_url',
        'mapa_rotas_url'     
      ]
    });
    res.status(200).json(estadios);
  } catch (error) {
    console.error('Erro ao buscar estádios:', error);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};

// --- FUNÇÃO 2: Buscar Um Estádio pelo Slug ---
// (Corrigida para renomear os campos para o frontend)
exports.buscarPorSlug = async (req, res) => {
  try {
    const { slug } = req.params;
    
    // 1. Busca o estádio pelo slug
    const estadioData = await Estadio.findOne({ 
      where: { slug: slug }
    });

    // 2. Se não encontrar, retorna 404 (o que causa o erro no frontend)
    if (!estadioData) {
      return res.status(404).json({ message: 'Estádio não encontrado.' });
    }
    
    // 3. Converte para JSON
    const estadio = estadioData.toJSON();

    // 4. Formata o objeto para bater 100% com o frontend
    const response = {
      name: estadio.nome,
      description: estadio.descricao,
      info: estadio.info_geral,
      routes: estadio.mapa_rotas_url,
      entrances: estadio.mapa_entradas,
      detailedMap: estadio.mapa_detalhado_url
    };
    
    // 5. Retorna o objeto formatado
    res.status(200).json(response);

  } catch (error) {
    // Se algo quebrar aqui (ex: 'toJSON' falhar),
    // o frontend também mostrará o erro
    console.error('Erro ao buscar estádio:', error);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};

// --- FUNÇÃO 3: Criar Estádio (Admin) ---
// Rota: POST /api/estadios
exports.create = async (req, res) => {
  try {
    const { 
      nome, slug, cidade, estado, capacidade_total, 
      apelido, descricao, imagem_url,
      // --- NOVOS CAMPOS ---
      mapa_detalhado_url, 
      mapa_rotas_url,
      // --------------------
      setores 
    } = req.body;

    if (!nome || !slug || !cidade || !estado || !capacidade_total) {
      return res.status(400).json({ message: 'Campos obrigatórios faltando.' });
    }

    const novoEstadio = await Estadio.create({
      nome, slug, cidade, estado, capacidade_total, 
      apelido, descricao, imagem_url,
      mapa_detalhado_url, // Salva no banco
      mapa_rotas_url,     // Salva no banco
      setores 
    }, {
      include: [{ model: Setor, as: 'setores' }]
    });

    res.status(201).json({ message: 'Estádio criado com sucesso!', estadio: novoEstadio });
  } catch (error) {
    console.error('Erro ao criar estádio:', error);
    res.status(500).json({ message: 'Erro interno ao criar estádio.' });
  }
};

// --- FUNÇÃO 4: Atualizar Estádio (Admin) ---
// Rota: PUT /api/estadios/:id
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const dadosAtualizados = req.body; 
    // O req.body agora trará 'mapa_detalhado_url', e o update do Sequelize
    // aceita qualquer campo que corresponda ao model automaticamente.

    const estadio = await Estadio.findByPk(id);
    if (!estadio) {
      return res.status(404).json({ message: 'Estádio não encontrado.' });
    }

    await estadio.update(dadosAtualizados);

    res.status(200).json({ message: 'Estádio atualizado com sucesso!', estadio });
  } catch (error) {
    console.error('Erro ao atualizar estádio:', error);
    res.status(500).json({ message: 'Erro interno ao atualizar estádio.' });
  }
};

// --- FUNÇÃO 5: Deletar Estádio (Admin) ---
// Rota: DELETE /api/estadios/:id
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const estadio = await Estadio.findByPk(id);

    if (!estadio) {
      return res.status(404).json({ message: 'Estádio não encontrado.' });
    }

    await estadio.destroy();
    res.status(200).json({ message: 'Estádio removido com sucesso.' });
  } catch (error) {
    console.error('Erro ao deletar estádio:', error);
    // Erro comum: Tentar apagar estádio que tem jogos vinculados
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({ message: 'Não é possível apagar este estádio pois existem jogos ou quiosques vinculados a ele.' });
    }
    res.status(500).json({ message: 'Erro interno ao deletar estádio.' });
  }
};