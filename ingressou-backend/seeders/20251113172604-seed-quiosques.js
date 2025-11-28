'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const agora = new Date();

    // --- ETAPA 1: Apaga os quiosques antigos para evitar duplicatas ---
    // (Isso permite que o seeder rode várias vezes sem erros)
    await queryInterface.bulkDelete('quiosques', {
      nome_quiosque: ["McDonald's", "Outback Steakhouse", "Santa Forneria"]
    }, {});

    // --- ETAPA 2: Busca os IDs dos estádios ---
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
    const neoId = estadioMap['neo-quimica-arena'];
    const maraId = estadioMap['maracana'];

    // --- ETAPA 3: Define os dados COMPLETOS dos quiosques ---
    const quiosques = [
      {
        nome_quiosque: "McDonald's",
        localizacao: "Neo Química Arena - Setor Leste Inferior",
        id_estadio: neoId,
        slogan: '"Amo muito tudo isso!"',
        category: "Fast Food",
        logo_url: "quiosque_mcdonalds.jpg",
        menu_link: "/quiosques/cardapios/1",
        // --- MUDANÇA (Adicionado) ---
        phone: "(11) 98765-4321",
        email: "mcdonalds@arena.com",
        // Timestamps
        createdAt: agora,
        updatedAt: agora
      },
      {
        nome_quiosque: "Outback Steakhouse",
        localizacao: "Maracanã - Setor Oeste",
        id_estadio: maraId,
        slogan: '"Viva o sabor Outback!"',
        category: "Steakhouse",
        logo_url: "quiosque_outback.png",
        menu_link: "/quiosques/cardapios/2",
        // --- MUDANÇA (Adicionado) ---
        phone: "(21) 99876-5432",
        email: "outback@maracana.com",
        // Timestamps
        createdAt: agora,
        updatedAt: agora
      },
      {
        nome_quiosque: "Santa Forneria",
        localizacao: "Maracanã - Setor Leste",
        id_estadio: maraId,
        slogan: '"O primeiro café & bistrô do Maracanã"',
        category: "Café & Bistrô",
        logo_url: "quiosque_santaforneria.jpg",
        menu_link: "/quiosques/cardapios/3",
        // --- MUDANÇA (Adicionado) ---
        phone: "(21) 98765-1234",
        email: "contato@santaforneria.com",
        // Timestamps
        createdAt: agora,
        updatedAt: agora
      },
    ];

    // --- ETAPA 4: Insere os quiosques completos ---
    await queryInterface.bulkInsert('quiosques', quiosques, {});
  },

  async down (queryInterface, Sequelize) {
    // A função 'down' continua a mesma, apaga os quiosques.
    await queryInterface.bulkDelete('quiosques', {
      nome_quiosque: ["McDonald's", "Outback Steakhouse", "Santa Forneria"]
    }, {});
  }
};