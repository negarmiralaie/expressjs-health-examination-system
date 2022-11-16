'use strict';
const { Model } = require('sequelize');
const paginate = require('sequelize-paginate');

module.exports = (sequelize, DataTypes) => {
  class HealthInfo extends Model {
    static associate(models) {
        HealthInfo.belongsTo(models.User, {
            foreignKey: 'examiner_id',
        },{ onDelete: 'CASCADE' });
        HealthInfo.belongsTo(models.User, {
            foreignKey: 'examined_id',
        },{ onDelete: 'CASCADE' });
    }
  }
  HealthInfo.init({
    examiner_id: DataTypes.INTEGER,
    examined_id: DataTypes.INTEGER,
    currentJobRole: DataTypes.STRING,
    currentJobDuty: DataTypes.STRING,
    currentJobStartingdate: DataTypes.STRING,
    resultDescription: DataTypes.TEXT,
    healthExpertSuggestion: DataTypes.ARRAY(DataTypes.STRING),
    diseaseBg: DataTypes.ARRAY(DataTypes.STRING),
    diseaseBgDescription: DataTypes.TEXT,
    height: DataTypes.STRING,
    weight: DataTypes.STRING,
    bmi: DataTypes.STRING,
    bmiStatus: DataTypes.STRING,
    bloodPressure: DataTypes.STRING,
    pulsePerMinute: DataTypes.STRING,
    testResults: DataTypes.ARRAY(DataTypes.STRING),
    testDescription: DataTypes.TEXT,
    examinationDescription: DataTypes.ARRAY(DataTypes.STRING),
    rightEyeVisualAcuity: DataTypes.STRING,
    leftEyeVisualAcuity: DataTypes.STRING,
    colorVision: DataTypes.STRING,
    visualField: DataTypes.STRING,
    depthVision: DataTypes.STRING,
    optometryDescription: DataTypes.TEXT,
    rightEarCondition: DataTypes.STRING,
    leftEarCondition: DataTypes.STRING,
    audiometryDescription: DataTypes.TEXT,
    spiro: DataTypes.STRING,
    spirometryDescription: DataTypes.TEXT,
    ecg: DataTypes.STRING,
    ecgDescription: DataTypes.TEXT,
    medicineExpertSuggest: DataTypes.TEXT,
    medicalAdvice: DataTypes.ARRAY(DataTypes.STRING),
    medicalAdviceDescription: DataTypes.TEXT,
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
    modelName: 'HealthInfo',
  });

  paginate.paginate(HealthInfo);
  return HealthInfo;
};