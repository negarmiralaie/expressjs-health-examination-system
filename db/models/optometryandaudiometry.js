const { Model } = require('sequelize');
const paginate = require('sequelize-paginate');

module.exports = (sequelize, DataTypes) => {
  class Optometryaudiometry extends Model {
    static associate(models) {
      Optometryaudiometry.belongsTo(models.User, {
        foreignKey: 'examiner_id',
      },{ onDelete: 'CASCADE' });
      Optometryaudiometry.belongsTo(models.User, {
        foreignKey: 'examined_id',
      },{ onDelete: 'CASCADE' });
    }
  }
  Optometryaudiometry.init({
    examiner_id: DataTypes.INTEGER,
    examined_id: DataTypes.INTEGER,
    rightEyeVisualAcuity: DataTypes.STRING,
    leftEyeVisualAcuity: DataTypes.STRING,
    colorVision: DataTypes.STRING,
    visualField: DataTypes.STRING,
    depthVision: DataTypes.STRING,
    optometryDescription: DataTypes.TEXT,
    rightEarCondition: DataTypes.STRING,
    leftEarCondition: DataTypes.STRING,
    audiometryDescription: DataTypes.TEXT,
    // isFilled: DataTypes.BOOLEAN,
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
    modelName: 'Optometryaudiometry',
  });

  paginate.paginate(Optometryaudiometry);
  return Optometryaudiometry;
};