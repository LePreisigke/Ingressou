'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Ingresso extends Model {
    static associate(models) {
      Ingresso.belongsTo(models.Usuario, {
        foreignKey: 'id_usuario',
        as: 'usuario'
      });
      Ingresso.belongsTo(models.Jogo, {
        foreignKey: 'id_jogo',
        as: 'jogo'
      });
      Ingresso.belongsTo(models.Setor, {
        foreignKey: 'id_setor',
        as: 'setor'
      });
    }
  }
  Ingresso.init({
    id_ingresso: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
  
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_jogo: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_setor: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    qr_code: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    status_pagamento: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
    
  }, {
    sequelize,
    modelName: 'Ingresso',
    tableName: 'ingressos',
    timestamps: true 
  });
  return Ingresso;
};