'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cardapio extends Model {
    static associate(models) {
      Cardapio.belongsTo(models.Quiosque, {
        foreignKey: 'id_quiosque',
        as: 'quiosque'
      });
    }
  }
  Cardapio.init({
    id_item: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nome_item: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    descricao: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    preco: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: false
    },
    id_quiosque: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
   
    category: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'Geral'
    }
   
  }, {
    sequelize,
    modelName: 'Cardapio',
    tableName: 'cardapios',
    timestamps: true
  });
  return Cardapio;
};