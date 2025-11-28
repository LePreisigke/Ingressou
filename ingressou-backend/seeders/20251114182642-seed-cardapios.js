'use strict';

// Helper para converter "R$ 32,90" em 32.90
const parsePrice = (priceStr) => {
  if (!priceStr) return 0.00;
  return parseFloat(priceStr.replace('R$ ', '').replace('.', '').replace(',', '.'));
};

module.exports = {
  async up (queryInterface, Sequelize) {
    const agora = new Date();

    // 1. Apaga itens antigos para evitar duplicatas
    await queryInterface.bulkDelete('cardapios', null, {});

    // 2. Busca os IDs dos Quiosques
    const quiosques = await queryInterface.sequelize.query(
      'SELECT id_quiosque, nome_quiosque FROM quiosques',
      { type: Sequelize.QueryTypes.SELECT, raw: true }
    );
    const quiosqueMap = {};
    quiosques.forEach(q => {
      quiosqueMap[q.nome_quiosque] = q.id_quiosque;
    });

    const mcId = quiosqueMap["McDonald's"];
    const outbackId = quiosqueMap["Outback Steakhouse"];
    const santaId = quiosqueMap["Santa Forneria"];

    // 3. Define os itens do menu
    const menuItems = [
      // McDonald's
      { id_quiosque: mcId, category: 'Combos', nome_item: 'Combo Big Mac', preco: parsePrice('R$ 32,90'), createdAt: agora, updatedAt: agora },
      { id_quiosque: mcId, category: 'Combos', nome_item: 'McChicken + refri', preco: parsePrice('R$ 28,00'), createdAt: agora, updatedAt: agora },
      { id_quiosque: mcId, category: 'Lanches avulsos', nome_item: 'Cheeseburger', preco: parsePrice('R$ 12,00'), createdAt: agora, updatedAt: agora },
      { id_quiosque: mcId, category: 'Lanches avulsos', nome_item: 'Batata média', preco: parsePrice('R$ 10,00'), createdAt: agora, updatedAt: agora },

      // Outback
      { id_quiosque: outbackId, category: 'Snacks', nome_item: "Bloomin' Onion (mini)", preco: parsePrice('R$ 36,00'), createdAt: agora, updatedAt: agora },
      { id_quiosque: outbackId, category: 'Snacks', nome_item: 'Fry Nachos', preco: parsePrice('R$ 29,90'), createdAt: agora, updatedAt: agora },
      { id_quiosque: outbackId, category: 'Bebidas', nome_item: 'Refrigerante', preco: parsePrice('R$ 9,00'), createdAt: agora, updatedAt: agora },
      { id_quiosque: outbackId, category: 'Bebidas', nome_item: 'Chopp', preco: parsePrice('R$ 14,00'), createdAt: agora, updatedAt: agora },

      // Santa Forneria
      { id_quiosque: santaId, category: 'Pizzas individuais', nome_item: 'Mussarela', preco: parsePrice('R$ 18,00'), createdAt: agora, updatedAt: agora },
      { id_quiosque: santaId, category: 'Pizzas individuais', nome_item: 'Calabresa', preco: parsePrice('R$ 19,50'), createdAt: agora, updatedAt: agora },
      { id_quiosque: santaId, category: 'Bebidas', nome_item: 'Água', preco: parsePrice('R$ 5,00'), createdAt: agora, updatedAt: agora },
      { id_quiosque: santaId, category: 'Bebidas', nome_item: 'Suco lata', preco: parsePrice('R$ 8,00'), createdAt: agora, updatedAt: agora },
    ];

    // 4. Insere os itens
    await queryInterface.bulkInsert('cardapios', menuItems, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('cardapios', null, {});
  }
};