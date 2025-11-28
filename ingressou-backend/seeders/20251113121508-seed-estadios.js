'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // A função UP é chamada quando rodamos o seeder
  async up (queryInterface, Sequelize) {
    
    // Pega a data/hora atual para os timestamps
    const agora = new Date();

    await queryInterface.bulkInsert('estadios', [
      // 1. NEO QUÍMICA ARENA
      {
        slug: 'neo-quimica-arena',
        nome: 'Neo Química Arena',
        apelido: 'A Casa do Povo',
        descricao: 'A Neo Química Arena, conhecida como Arena Corinthians, foi inaugurada em 10 de maio de 2014, após três anos de construção. O estádio sediou a abertura da Copa do Mundo de 2014 e se tornou a casa oficial do Corinthians. Sua capacidade atual é de cerca de 48.905 torcedores.',
        imagem_url: '/assets/Neoquimica.png', // Caminho da imagem (você pode ajustar)
        cidade: 'São Paulo',
        estado: 'SP',
        capacidade_total: 48905,
        
        // --- Dados em JSON do StadiumMap.jsx ---
        info_geral: JSON.stringify({
          Informações: [
            'Capacidade: 49.205 (padrão FIFA)',
            'Inauguração: 10 de maio de 2014',
            'Localização: Av. Miguel Ignácio Curi, 111 - Artur Alvim, São Paulo - SP',
            'Time: Sport Club Corinthians Paulista',
          ]
        }),
        mapa_rotas_url: '/assets/NeoQuimica_Rotas.jpg',
        mapa_entradas: JSON.stringify({
          Oeste: '/assets/NeoQuimica_EntradaOeste.jpg',
          Sul: '/assets/NeoQuimica_EntradaSul.jpg',
          Leste: '/assets/NeoQuimica_EntradaLeste.jpg',
          Norte: '/assets/NeoQuimica_EntradaNorte.jpg',
        }),
        mapa_detalhado_url: '/assets/NeoQuimica_MapaDetalhado.jpg',
        
        // Timestamps obrigatórios
        createdAt: agora,
        updatedAt: agora
      },
      
      // 2. MARACANÃ
      {
        slug: 'maracana',
        nome: 'Maracanã',
        apelido: 'O Maior do Mundo',
        descricao: 'O Estádio Jornalista Mário Filho, mais conhecido como Maracanã, é um dos templos do futebol mundial. Inaugurado em 1950 para a Copa do Mundo, já foi palco de duas finais de Copa e é o estádio de grandes clássicos do futebol carioca.',
        imagem_url: '/assets/Maracana.jpg',
        cidade: 'Rio de Janeiro',
        estado: 'RJ',
        capacidade_total: 78838,

        // --- Dados em JSON do StadiumMap.jsx ---
        info_geral: JSON.stringify({
          Informações: [
            'Capacidade: 78.838',
            'Inauguração: 1950',
            'Localização: Av. Pres. Castelo Branco, Portão 3 - Maracanã, Rio de Janeiro - RJ',
            'Times: Flamengo e Fluminense',
          ],
          'Como Chegar': [
            '🚗 De Carro: Av. Presidente Castelo Branco...',
            '🚇 De Metrô: Estação Maracanã (Linha 2)...',
            '🚆 De Trem (SuperVia): Estação Maracanã.',
          ]
        }),
        mapa_rotas_url: '/assets/Maracana_Rotas.jpg',
        mapa_entradas: JSON.stringify({
          'Mapa de Entradas e Bilheterias': '/assets/Maracana_Entradas.jpg',
        }),
        mapa_detalhado_url: '/assets/Maracana_Entradas.jpg',

        // Timestamps obrigatórios
        createdAt: agora,
        updatedAt: agora
      }
      
      // Você pode adicionar o Allianz Parque aqui depois...

    ], {});
  },

  // A função DOWN é chamada para reverter o seeder
  async down (queryInterface, Sequelize) {
    // Remove todos os estádios com esses slugs
    await queryInterface.bulkDelete('estadios', {
      slug: ['neo-quimica-arena', 'maracana']
    }, {});
  }
};