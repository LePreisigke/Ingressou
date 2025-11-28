'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ingressos', {
      id_ingresso: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_usuario: {
        type: Sequelize.INTEGER,
        allowNull: false, 
        references: {
          model: 'usuarios',
          key: 'id_usuario'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      id_jogo: {
        type: Sequelize.INTEGER,
        allowNull: false, 
        references: {
          model: 'jogos',
          key: 'id_jogo'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL' 
      },
      id_setor: {
        type: Sequelize.INTEGER,
        allowNull: false, 
        references: {
          model: 'setores',
          key: 'id_setor'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL' 
      },
      qr_code: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      status_pagamento: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
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
    await queryInterface.dropTable('ingressos');
  }
};