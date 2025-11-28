'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('usuarios', {
      id_usuario: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nome: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      email: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
      },
      senha_hash: { 
        type: Sequelize.STRING(255),
        allowNull: false
      },
      telefone: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      pais: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      cidade: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      cep: {
        type: Sequelize.STRING(15),
        allowNull: false
      },
      bairro: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      rua: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      numero: {
        type: Sequelize.STRING(10),
        allowNull: false
      },
      complemento: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      times_favoritos: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      estadios_favoritos: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      quiosques_favoritos: {
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
    await queryInterface.dropTable('usuarios');
  }
};