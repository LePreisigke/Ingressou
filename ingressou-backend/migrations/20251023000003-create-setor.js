'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('setores', {
      id_setor: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nome_setor: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      preco: {
        type: Sequelize.DECIMAL(8, 2),
        allowNull: false
      },
      capacidade_setor: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      id_estadio: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'estadios',
          key: 'id_estadio'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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
    await queryInterface.dropTable('setores');
  }
};