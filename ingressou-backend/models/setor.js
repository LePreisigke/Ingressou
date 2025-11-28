'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Setor extends Model {
    static associate(models) {
      Setor.belongsTo(models.Estadio, {
        foreignKey: 'id_estadio',
        as: 'estadio'
      });
      Setor.hasMany(models.Ingresso, {
        foreignKey: 'id_setor',
        as: 'ingressos'
      });
    }
  }
  Setor.init({
    id_setor: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nome_setor: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    preco: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: false
    },
    capacidade_setor: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_estadio: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Setor',
    tableName: 'setores',
    timestamps: true 
  });
  return Setor;
};