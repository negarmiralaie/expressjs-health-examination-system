'use strict';
const { Model } = require('sequelize');
const paginate = require('sequelize-paginate');
const { FactoryStatus } = require('../../components/enums');

// TODO:
module.exports = (sequelize, DataTypes) => {
  class Bpms extends Model {
  }
  Bpms.init(
    {
      title: DataTypes.STRING,
      showOnOrderList: DataTypes.ARRAY(DataTypes.INTEGER),
      details: DataTypes.ARRAY(DataTypes.INTEGER),
      changeStatusFrom: DataTypes.ARRAY(DataTypes.INTEGER),
      changeStatusTo: DataTypes.ARRAY(DataTypes.INTEGER),
      edit: DataTypes.JSONB,
    },
    {
      sequelize,
      modelName: 'Bpms',
    }
  );

  paginate.paginate(Bpms);
  return Bpms;
};
