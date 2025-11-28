// controllers/cardapioController.js

const db = require('../models');
const Quiosque = db.Quiosque;
const Cardapio = db.Cardapio;

// --- FUNÇÃO: Buscar Cardápio de um Quiosque ---
// Rota: GET /api/cardapios/:id_quiosque
exports.buscarPorQuiosque = async (req, res) => {
  try {
    // 1. Pega o ID do quiosque da URL
    const { id_quiosque } = req.params;

    // 2. Busca as informações do Quiosque (o cabeçalho)
    const quiosque = await Quiosque.findByPk(id_quiosque, {
      attributes: [
        ['nome_quiosque', 'name'],
        'slogan',
        ['logo_url', 'logo'],
       ['localizacao', 'location'],
        'phone',
        'email'
      ]
    });

    if (!quiosque) {
      return res.status(404).json({ message: 'Quiosque não encontrado.' });
    }

    // 3. Busca todos os itens do cardápio desse quiosque
    const items = await Cardapio.findAll({
      where: { id_quiosque: id_quiosque },
      attributes: [
        ['nome_item', 'item'],
        ['preco', 'price'],
        'category'
      ],
      order: [['category', 'ASC'], ['nome_item', 'ASC']]
    });

    // 4. Agrupa os itens por categoria (Ex: "Combos": [...])
    const menuAgrupado = {};
    items.forEach(item => {
      const category = item.category;
      if (!menuAgrupado[category]) {
        menuAgrupado[category] = [];
      }
      menuAgrupado[category].push({
        item: item.dataValues.item, // Usamos dataValues para pegar os nomes 'item' e 'price'
        price: `R$ ${parseFloat(item.dataValues.price).toFixed(2).replace('.', ',')}`
      });
    });

    // 5. Combina tudo em uma única resposta
    const response = {
      ...quiosque.toJSON(),
      menu: menuAgrupado
    };

    res.status(200).json(response);

  } catch (error) {
    console.error('Erro ao buscar cardápio:', error);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};