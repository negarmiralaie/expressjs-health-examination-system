'use strict';
const { Model } = require('sequelize');
const paginate = require('sequelize-paginate');

module.exports = (sequelize, DataTypes) => {
  class Case extends Model {
    static associate(models) {
      // Case.belongsTo(models.Factory, {
      //   foreignKey: 'factory_id',
      // },{ onDelete: 'CASCADE', hooks: true });
      Case.belongsTo(models.Factory, {
        foreignKey: 'factory_id',
      },{ onDelete: 'CASCADE' });
    }
  }
  Case.init({
    factory_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fileUrl: {
      type: DataTypes.STRING,
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
    modelName: 'Case',
  });

  paginate.paginate(Case);
  return Case;
};