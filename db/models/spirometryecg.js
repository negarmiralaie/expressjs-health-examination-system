'use strict';
const { Model } = require('sequelize');
const paginate = require('sequelize-paginate');

module.exports = (sequelize, DataTypes) => {
  class SpirometryEcg extends Model {
    static associate(models) {
      SpirometryEcg.belongsTo(models.User, {
        foreignKey: 'examiner_id',
      },{ onDelete: 'CASCADE' });
      SpirometryEcg.belongsTo(models.User, {
        foreignKey: 'examined_id',
      },{ onDelete: 'CASCADE' });
    }
  }
  SpirometryEcg.init({
    examiner_id: DataTypes.INTEGER,
    examined_id: DataTypes.INTEGER,
    spiro: DataTypes.STRING,
    spirometryDescription: DataTypes.STRING,
    ecg: DataTypes.STRING,
    ecgDescription: DataTypes.STRING,
    medicineExpertSuggest: DataTypes.STRING,
    medicalAdvice: DataTypes.ARRAY(DataTypes.STRING),
    description: DataTypes.STRING,
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
    modelName: 'SpirometryEcg',
  });

  paginate.paginate(SpirometryEcg);
  return SpirometryEcg;
};

// آگاهی این شکلیه که از 
// علت اینکه رنگ روی کعبه سیاهه و داخلش سفیده اینه که ما باید از سیاه به سفید برسیم
// همینطور علت اینکه نینیاک سیاه و سفیده
// افراسیاب خود توعه
// تو خودت همه اینایی
