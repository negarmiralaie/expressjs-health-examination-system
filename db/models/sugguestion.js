'use strict';
const { Model } = require('sequelize');
const paginate = require('sequelize-paginate');

module.exports = (sequelize, DataTypes) => {
  class Sugguestion extends Model {
    static associate(models) {
      Sugguestion.belongsTo(models.User, {
        foreignKey: 'user_id',
      },{ onDelete: 'CASCADE' });
      Sugguestion.belongsTo(models.Factory, {
        foreignKey: 'factory_id',
      },{ onDelete: 'CASCADE' });
    }
  }
  Sugguestion.init({
    user_id: DataTypes.INTEGER,
    factory_id: DataTypes.INTEGER,
    title: { 
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
  }, {
    sequelize,
    modelName: 'Sugguestion',
  });

  paginate.paginate(Sugguestion);
  return Sugguestion;
};