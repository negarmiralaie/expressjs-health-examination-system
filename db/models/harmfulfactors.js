'use strict';
const { Model } = require('sequelize');
const paginate = require('sequelize-paginate');

module.exports = (sequelize, DataTypes) => {
  class Harmfulfactor extends Model {
    static associate(models) {
      Harmfulfactor.belongsTo(models.User, {
        foreignKey: 'examiner_id',
      },{ onDelete: 'CASCADE' });
      Harmfulfactor.belongsTo(models.User, {
        foreignKey: 'examined_id',
      },{ onDelete: 'CASCADE' });
    }
  }
  Harmfulfactor.init({
    examiner_id: DataTypes.INTEGER,
    examined_id: DataTypes.INTEGER,
    currentJobRole: DataTypes.STRING,
    currentJobDuty: DataTypes.STRING,
    currentJobStartingdate: DataTypes.STRING,
    resultDescription: DataTypes.TEXT,
    healthExpertSuggestion: DataTypes.ARRAY(DataTypes.STRING),
    DiseaseBg: DataTypes.ARRAY(DataTypes.STRING),
    description: DataTypes.TEXT,
    height: DataTypes.STRING,
    weight: DataTypes.STRING,
    bmi: DataTypes.STRING,
    bmiStatus: DataTypes.STRING,
    isFormFilled: {
      type: DataTypes.VIRTUAL,
      get() {
        return Boolean(this.examiner_id) // A boolean
      },
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
    modelName: 'Harmfulfactor',
  });

  paginate.paginate(Harmfulfactor);
  return Harmfulfactor;
};