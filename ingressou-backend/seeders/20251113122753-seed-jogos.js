'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const agora = new Date();

    // 1. Buscar os IDs dos estádios
    const estadios = await queryInterface.sequelize.query(
      'SELECT id_estadio, slug FROM estadios WHERE slug IN (:slugs)',
      {
        replacements: { slugs: ['neo-quimica-arena', 'maracana'] },
        type: Sequelize.QueryTypes.SELECT,
        raw: true
      }
    );
    const estadioMap = {};
    estadios.forEach(e => {
      estadioMap[e.slug] = e.id_estadio;
    });

    // Pega os IDs para usar nos jogos
    const neoId = estadioMap['neo-quimica-arena'];
    const maraId = estadioMap['maracana'];

    // 2. Definir os jogos
    const jogos = [
      // Jogo na Neo Química
      {
        time_casa: 'Corinthians',
        time_visitante: 'São Paulo',
        data_jogo: new Date('2025-11-20'), // Altere para uma data futura
        horario: '16:00:00',
        campeonato: 'Brasileirão',
        rodada: 35,
        id_estadio: neoId,
        createdAt: agora,
        updatedAt: agora
      },
      // Jogo no Maracanã
      {
        time_casa: 'Flamengo',
        time_visitante: 'Vasco',
        data_jogo: new Date('2025-11-23'), // Altere para uma data futura
        horario: '21:00:00',
        campeonato: 'Brasileirão',
        rodada: 36,
        id_estadio: maraId,
        createdAt: agora,
        updatedAt: agora
      },
      // Outro jogo no Maracanã
      {
        time_casa: 'Botafogo',
        time_visitante: 'São Paulo',
        data_jogo: new Date('2025-11-30'), // Altere para uma data futura
        horario: '16:00:00',
        campeonato: 'Brasileirão',
        rodada: 37,
        id_estadio: maraId,
        createdAt: agora,
        updatedAt: agora
      }
    ];

    // 3. Inserir os jogos
    await queryInterface.bulkInsert('jogos', jogos, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('jogos', null, {});
  }
};