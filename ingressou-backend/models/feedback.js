'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Feedback extends Model {
    static associate(models) {
      Feedback.belongsTo(models.Usuario, {
        foreignKey: 'id_usuario',
        as: 'usuario'
      });
      Feedback.belongsTo(models.Jogo, {
        foreignKey: 'id_jogo',
        as: 'jogo'
      });
    }
  }
  Feedback.init({
    id_feedback: {
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
    nota: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5
      }
    },
    comentario: {
      type: DataTypes.STRING(255),
      allowNull: true 
    },
    
  }, {
    sequelize,
    modelName: 'Feedback',
    tableName: 'feedbacks',
    timestamps: true 
  });
  return Feedback;
};