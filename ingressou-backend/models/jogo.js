'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Jogo extends Model {
    static associate(models) {
      Jogo.belongsTo(models.Estadio, {
        foreignKey: 'id_estadio',
        as: 'estadio'
      });
      Jogo.hasMany(models.Ingresso, {
        foreignKey: 'id_jogo',
        as: 'ingressos'
      });
      Jogo.hasMany(models.Feedback, {
        foreignKey: 'id_jogo',
        as: 'feedbacks'
      });
    }
  }
  Jogo.init({
    id_jogo: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    
    time_casa: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    time_visitante: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    data_jogo: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    horario: {
      type: DataTypes.TIME,
      allowNull: false
    },
    
    campeonato: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    rodada: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    id_estadio: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Jogo',
    tableName: 'jogos',
    timestamps: true 
  });
  return Jogo;
};