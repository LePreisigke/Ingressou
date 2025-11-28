'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    // Remove as 3 colunas de string
    await queryInterface.removeColumn('usuarios', 'times_favoritos');
    await queryInterface.removeColumn('usuarios', 'estadios_favoritos');
    await queryInterface.removeColumn('usuarios', 'quiosques_favoritos');
  },

  async down(queryInterface, Sequelize) {
    // Adiciona as colunas de volta se precisarmos reverter
    await queryInterface.addColumn('usuarios', 'times_favoritos', {
      type: Sequelize.STRING(255),
      allowNull: true
    });
    await queryInterface.addColumn('usuarios', 'estadios_favoritos', {
      type: Sequelize.STRING(255),
      allowNull: true
    });
    await queryInterface.addColumn('usuarios', 'quiosques_favoritos', {
      type: Sequelize.STRING(255),
      allowNull: true
    });
  }
};