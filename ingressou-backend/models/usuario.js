'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Usuario extends Model {
    static associate(models) {
      // Associações existentes (mantidas)
      Usuario.hasMany(models.Ingresso, {
        foreignKey: 'id_usuario',
        as: 'ingressos'
      });
      Usuario.hasMany(models.Feedback, {
        foreignKey: 'id_usuario',
        as: 'feedbacks'
      });
      
      // 1. Para Times Favoritos (1-para-N)
      // Um usuário TEM MUITOS Nomes de Times Favoritos
      Usuario.hasMany(models.UsuarioTimeFavorito, {
        foreignKey: 'id_usuario',
        as: 'timesFavoritos' // Usaremos este 'as' para carregar
      });

      // 2. Para Estádios Favoritos (N-para-N)
      // Um usuário PERTENCE A MUITOS Estádios, através da tabela 'usuario_estadio_favorito'
      Usuario.belongsToMany(models.Estadio, {
        through: 'usuario_estadio_favorito', // Nome da tabela de junção
        foreignKey: 'id_usuario',
        otherKey: 'id_estadio',
        as: 'estadiosFavoritos' // Usaremos este 'as'
      });

      // 3. Para Quiosques Favoritos (N-para-N)
      // Um usuário PERTENCE A MUITOS Quiosques, através da tabela 'usuario_quiosque_favorito'
      Usuario.belongsToMany(models.Quiosque, {
        through: 'usuario_quiosque_favorito', // Nome da tabela de junção
        foreignKey: 'id_usuario',
        otherKey: 'id_quiosque',
        as: 'quiosquesFavoritos' // Usaremos este 'as'
      });
    }
  }
  Usuario.init({
    id_usuario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nome: {
      type: DataTypes.STRING(100),
      allowNull: false 
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: false, 
      unique: true
    },
    senha_hash: {
      type: DataTypes.STRING(255),
      allowNull: false 
    },
    telefone: {
      type: DataTypes.STRING(20),
      allowNull: false 
    },
    pais: {
      type: DataTypes.STRING(50),
      allowNull: false 
    },
    cidade: {
      type: DataTypes.STRING(50),
      allowNull: false 
    },
    cep: {
      type: DataTypes.STRING(15),
      allowNull: false
    },
    bairro: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    rua: {
      type: DataTypes.STRING(100),
      allowNull: false 
    },
    numero: {
      type: DataTypes.STRING(10),
      allowNull: false 
    },
    complemento: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    is_admin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
      
  }, {
    sequelize,
    modelName: 'Usuario',
    tableName: 'usuarios',
    timestamps: true
  });
  return Usuario;
};