'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Estadio extends Model {
    static associate(models) {
      // Associações existentes
      Estadio.hasMany(models.Setor, {
        foreignKey: 'id_estadio',
        as: 'setores'
      });
      Estadio.hasMany(models.Quiosque, {
        foreignKey: 'id_estadio',
        as: 'quiosques'
      });
      Estadio.hasMany(models.Jogo, {
        foreignKey: 'id_estadio',
        as: 'jogos'
      });

      // Um Estádio PERTENCE A MUITOS Usuários (que o favoritaram)
      Estadio.belongsToMany(models.Usuario, {
        through: 'usuario_estadio_favorito',
        foreignKey: 'id_estadio',
        otherKey: 'id_usuario',
        as: 'favoritadoPor'
      });
    }
  }
  Estadio.init({
    // ... (o init() do Estadio permanece o mesmo, sem alterações) ...
    id_estadio: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    slug: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    nome: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    apelido: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    imagem_url: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    cidade: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    estado: {
      type: DataTypes.CHAR(2),
      allowNull: false
    },
    capacidade_total: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    info_geral: {
      type: DataTypes.JSON,
      allowNull: true
    },
    mapa_rotas_url: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    mapa_entradas: {
      type: DataTypes.JSON,
      allowNull: true
    },
    mapa_detalhado_url: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
  }, {
    sequelize,
    modelName: 'Estadio',
    tableName: 'estadios',
    timestamps: true
  });
  return Estadio;
};