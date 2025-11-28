'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('estadios', {
      id_estadio: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      slug: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true
      },
      nome: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      apelido: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      descricao: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      imagem_url: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      cidade: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      estado: {
        type: Sequelize.CHAR(2),
        allowNull: false
      },
      capacidade_total: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      info_geral: {
        type: Sequelize.JSON,
        allowNull: true
      },
      mapa_rotas_url: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      mapa_entradas: {
        type: Sequelize.JSON,
        allowNull: true
      },
      mapa_detalhado_url: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()')
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('estadios');
  }
};