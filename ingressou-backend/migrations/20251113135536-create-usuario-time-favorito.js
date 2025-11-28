'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('usuario_time_favorito', {
      // Não precisa de 'id' próprio
      id_usuario: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'usuarios', key: 'id_usuario' },
        onDelete: 'CASCADE',
        primaryKey: true // Parte da chave primária composta
      },
      nome_time: {
        type: Sequelize.STRING(50),
        allowNull: false,
        primaryKey: true // Parte da chave primária composta
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('usuario_time_favorito');
  }
};