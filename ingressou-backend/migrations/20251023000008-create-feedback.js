'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('feedbacks', {
      id_feedback: {
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
      nota: {
        type: Sequelize.INTEGER,
        allowNull: false,
        constraints: {
          check: Sequelize.literal('nota BETWEEN 1 AND 5')
        }
      },
      comentario: {
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
    await queryInterface.dropTable('feedbacks');
  }
};