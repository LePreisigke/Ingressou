'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Adiciona a coluna 'category'
    await queryInterface.addColumn('cardapios', 'category', {
      type: Sequelize.STRING(50),
      allowNull: false,
      defaultValue: 'Geral' // Um valor padrão
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('cardapios', 'category');
  }
};