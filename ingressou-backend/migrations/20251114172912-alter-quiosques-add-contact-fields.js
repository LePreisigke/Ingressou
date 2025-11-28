'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Adiciona as 2 novas colunas
    await queryInterface.addColumn('quiosques', 'phone', {
      type: Sequelize.STRING(30), // Espaço para (XX) 9XXXX-XXXX
      allowNull: true
    });
    await queryInterface.addColumn('quiosques', 'email', {
      type: Sequelize.STRING(100), // Espaço para email
      allowNull: true
    });
  },

  async down (queryInterface, Sequelize) {
    // Remove as 2 colunas
    await queryInterface.removeColumn('quiosques', 'phone');
    await queryInterface.removeColumn('quiosques', 'email');
  }
};