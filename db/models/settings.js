'use strict';
const { Model } = require('sequelize');
const paginate = require('sequelize-paginate');

module.exports = (sequelize, DataTypes) => {
  class Settings extends Model {

  }
  
  Settings.init({
    factoryName: DataTypes.STRING,
    logoUrl: DataTypes.STRING,
    loginPhotoUrl: DataTypes.STRING,
    panelUsername: DataTypes.STRING,
    panelPassword: DataTypes.STRING,
    message: DataTypes.STRING,
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
    modelName: 'Settings',
  });

  paginate.paginate(Settings);
  return Settings;
};