'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('jogos', {
      id_jogo: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      time_casa: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      time_visitante: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      data_jogo: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      horario: {
        type: Sequelize.TIME,
        allowNull: false
      },
      campeonato: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      rodada: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      id_estadio: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'estadios',
          key: 'id_estadio'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT' // Mantendo padrão, mas o PDF não especifica para Jogo
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
    await queryInterface.dropTable('jogos');
  }
};

