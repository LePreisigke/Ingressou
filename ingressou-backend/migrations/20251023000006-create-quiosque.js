'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('quiosques', {
      id_quiosque: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nome_quiosque: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      localizacao: {
        type: Sequelize.STRING(100),
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

   
    await queryInterface.addConstraint('quiosques', {
      fields: ['nome_quiosque', 'id_estadio'],
      type: 'unique',
      name: 'unique_quiosque_nome_estadio'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('quiosques');
  }
};

