'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('cardapios', {
      id_item: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nome_item: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      descricao: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      preco: {
        type: Sequelize.DECIMAL(8, 2),
        allowNull: false
      },
      id_quiosque: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'quiosques',
          key: 'id_quiosque'
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
    await queryInterface.dropTable('cardapios');
  }
};

