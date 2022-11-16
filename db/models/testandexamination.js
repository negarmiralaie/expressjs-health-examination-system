'use strict';
const { Model } = require('sequelize');
const paginate = require('sequelize-paginate');

module.exports = (sequelize, DataTypes) => {
  class TestExamination extends Model {
    static associate(models) {
      // TestExamination.belongsTo(models.Personnel, {
      //   foreignKey: 'examined_id',
      // },{ onDelete: 'CASCADE' });
      // TestExamination.hasOne(models.User, {
      //   foreignKey: 'examinerr_id',
      // },{ onDelete: 'CASCADE' });
      TestExamination.belongsTo(models.User, {
        foreignKey: 'examiner_id',
      },{ onDelete: 'CASCADE' });
      TestExamination.belongsTo(models.User, {
        foreignKey: 'examined_id',
      },{ onDelete: 'CASCADE' });
    }
  }

  TestExamination.init({
    examiner_id: DataTypes.INTEGER,
    examined_id: DataTypes.INTEGER,
    bloodPressure: DataTypes.STRING,
    pulsePerMinute: DataTypes.STRING,
    testResults: DataTypes.ARRAY(DataTypes.STRING),
    testDescription: DataTypes.TEXT,
    examinationDescription: DataTypes.ARRAY(DataTypes.STRING),
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
    modelName: 'TestExamination',
  });

  paginate.paginate(TestExamination);
  return TestExamination;
};