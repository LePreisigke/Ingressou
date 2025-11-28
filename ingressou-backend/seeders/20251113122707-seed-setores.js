'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const agora = new Date();

    // 1. Buscar os IDs dos estádios que já cadastramos
    // Usamos 'raw: true' e 'type: Sequelize.QueryTypes.SELECT'
    const estadios = await queryInterface.sequelize.query(
      'SELECT id_estadio, slug FROM estadios WHERE slug IN (:slugs)',
      {
        replacements: { slugs: ['neo-quimica-arena', 'maracana'] },
        type: Sequelize.QueryTypes.SELECT,
        raw: true
      }
    );

    // Mapeia os slugs para IDs para facilitar
    const estadioMap = {};
    estadios.forEach(e => {
      estadioMap[e.slug] = e.id_estadio;
    });

    const neoId = estadioMap['neo-quimica-arena'];
    const maraId = estadioMap['maracana'];

    // 2. Definir os setores para cada estádio
    const setores = [
      // --- Setores da Neo Química Arena ---
      { nome_setor: 'Norte', preco: 50.00, capacidade_setor: 5000, id_estadio: neoId, createdAt: agora, updatedAt: agora },
      { nome_setor: 'Sul', preco: 50.00, capacidade_setor: 5000, id_estadio: neoId, createdAt: agora, updatedAt: agora },
      { nome_setor: 'Leste Superior', preco: 80.00, capacidade_setor: 4000, id_estadio: neoId, createdAt: agora, updatedAt: agora },
      { nome_setor: 'Leste Inferior', preco: 120.00, capacidade_setor: 3500, id_estadio: neoId, createdAt: agora, updatedAt: agora },
      { nome_setor: 'Oeste Superior', preco: 100.00, capacidade_setor: 3000, id_estadio: neoId, createdAt: agora, updatedAt: agora },
      { nome_setor: 'Oeste Inferior', preco: 150.00, capacidade_setor: 3000, id_estadio: neoId, createdAt: agora, updatedAt: agora },

      // --- Setores do Maracanã ---
      { nome_setor: 'Norte', preco: 60.00, capacidade_setor: 10000, id_estadio: maraId, createdAt: agora, updatedAt: agora },
      { nome_setor: 'Sul', preco: 60.00, capacidade_setor: 10000, id_estadio: maraId, createdAt: agora, updatedAt: agora },
      { nome_setor: 'Leste Superior', preco: 90.00, capacidade_setor: 8000, id_estadio: maraId, createdAt: agora, updatedAt: agora },
      { nome_setor: 'Leste Inferior', preco: 130.00, capacidade_setor: 7000, id_estadio: maraId, createdAt: agora, updatedAt: agora },
      { nome_setor: 'Maracanã Mais', preco: 400.00, capacidade_setor: 1000, id_estadio: maraId, createdAt: agora, updatedAt: agora },
    ];
    
    // 3. Inserir os setores
    await queryInterface.bulkInsert('setores', setores, {});
  },

  async down (queryInterface, Sequelize) {
    // Remove todos os setores
    await queryInterface.bulkDelete('setores', null, {});
  }
};