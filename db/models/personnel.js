'use strict';
const { Model } = require('sequelize');
const paginate = require('sequelize-paginate');

module.exports = (sequelize, DataTypes) => {
  class Personnel extends Model {
    static associate(models) {
      // Personnel.belongsTo(models.User, {
      //   foreignKey: 'examiner_id',
      // },{ onDelete: 'CASCADE' });
      Personnel.belongsTo(models.Factory, {
        foreignKey: 'factory_id',
      },{ onDelete: 'CASCADE' });
      // Personnel.hasMany(models.TestExamination, {
      //   foreignKey: 'examined_id',
      // },{ onDelete: 'CASCADE' });
    }
  }
  Personnel.init({
    factoryName: DataTypes.STRING,
    examinationType: DataTypes.STRING,
    date: DataTypes.STRING,
    fileNo: DataTypes.STRING,
    personalNo: DataTypes.STRING,
    fullName: DataTypes.STRING,
    fatherName: DataTypes.STRING,
    gender: DataTypes.STRING,
    maritalStatus: DataTypes.STRING,
    childrenNumber: DataTypes.STRING,
    birthYear: DataTypes.STRING,
    SSN: DataTypes.STRING,
    militaryStatus: DataTypes.STRING,
    serviceLine: DataTypes.STRING,
    description: DataTypes.STRING,
    status: DataTypes.STRING,
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
    modelName: 'Personnel',
  });

  paginate.paginate(Personnel);
  return Personnel;
};