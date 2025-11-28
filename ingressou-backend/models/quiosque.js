'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Quiosque extends Model {
    static associate(models) {
      // Associações existentes (mantidas)
      Quiosque.belongsTo(models.Estadio, {
        foreignKey: 'id_estadio',
        as: 'estadio'
      });
      Quiosque.hasMany(models.Cardapio, {
        foreignKey: 'id_quiosque',
        as: 'cardapios'
      });
      Quiosque.belongsToMany(models.Usuario, {
        through: 'usuario_quiosque_favorito',
        foreignKey: 'id_quiosque',
        otherKey: 'id_usuario',
        as: 'favoritadoPor'
      });
    }
  }
  Quiosque.init({
    id_quiosque: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nome_quiosque: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: 'unique_quiosque_nome_estadio' 
    },
    localizacao: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    id_estadio: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: 'unique_quiosque_nome_estadio'
    },
    slogan: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    category: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    logo_url: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    menu_link: {
      type: DataTypes.STRING(255),
      allowNull: true
    },

    phone: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true
    }
   
  }, {
    sequelize,
    modelName: 'Quiosque',
    tableName: 'quiosques',
    timestamps: true
  });
  return Quiosque;
};