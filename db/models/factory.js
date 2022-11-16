'use strict';
const { Model } = require('sequelize');
const paginate = require('sequelize-paginate');
const db = require('../../db/models');

module.exports = (sequelize, DataTypes) => {
  class Factory extends Model {
    static associate(models) {
      Factory.hasMany(models.User, {
        foreignKey: 'factory_id',
      },{ onDelete: 'CASCADE' });
      Factory.hasMany(models.Case, {
        foreignKey: 'factory_id',
      },{ onDelete: 'CASCADE' });
      Factory.hasMany(models.Sugguestion, {
        foreignKey: 'factory_id',
      },{ onDelete: 'CASCADE' });
    }
  }
  Factory.init({
    abbrvCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mobile:{
      type: DataTypes.STRING,
    },
    status:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    numberOfPersonnels: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    numberOfCases: {
      type: DataTypes.INTEGER,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
  }, {
    sequelize,
    modelName: 'Factory',
  });

  paginate.paginate(Factory);
  return Factory;
};