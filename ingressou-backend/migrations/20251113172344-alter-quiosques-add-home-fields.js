'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Adiciona as 4 novas colunas que o frontend da Home precisa
    await queryInterface.addColumn('quiosques', 'slogan', {
      type: Sequelize.STRING(100),
      allowNull: true
    });
    await queryInterface.addColumn('quiosques', 'category', {
      type: Sequelize.STRING(50),
      allowNull: true
    });
    await queryInterface.addColumn('quiosques', 'logo_url', {
      type: Sequelize.STRING(255),
      allowNull: true
    });
    await queryInterface.addColumn('quiosques', 'menu_link', {
      type: Sequelize.STRING(255),
      allowNull: true
    });
  },

  async down (queryInterface, Sequelize) {
    // Remove as 4 colunas se precisarmos reverter
    await queryInterface.removeColumn('quiosques', 'slogan');
    await queryInterface.removeColumn('quiosques', 'category');
    await queryInterface.removeColumn('quiosques', 'logo_url');
    await queryInterface.removeColumn('quiosques', 'menu_link');
  }
};