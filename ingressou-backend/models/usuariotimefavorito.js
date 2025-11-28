'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UsuarioTimeFavorito extends Model {
    static associate(models) {
      // Define a associação de volta ao Usuário
      UsuarioTimeFavorito.belongsTo(models.Usuario, {
        foreignKey: 'id_usuario'
      });
    }
  }
  UsuarioTimeFavorito.init({
    id_usuario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false
    },
    nome_time: {
      type: DataTypes.STRING(50),
      primaryKey: true,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'UsuarioTimeFavorito',
    tableName: 'usuario_time_favorito',
    timestamps: true 
  });
  return UsuarioTimeFavorito;
};