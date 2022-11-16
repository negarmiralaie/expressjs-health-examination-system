'use strict';
const { Model } = require('sequelize');
const paginate = require('sequelize-paginate');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Sugguestion, {
        foreignKey: 'user_id',
      },{ onDelete: 'CASCADE' });
      // User.hasMany(models.Personnel, {
      //   foreignKey: 'examiner_id',
      // },{ onDelete: 'CASCADE' });
      // User.belongsTo(models.User, {
      //   foreignKey: 'examiner_id',
      // },{ onDelete: 'CASCADE' });
      User.belongsTo(models.Factory, {
        foreignKey: 'factory_id',
      },{ onDelete: 'CASCADE' });
      // User.belongsTo(models.TestExamination, {
      //   foreignKey: 'examinerr_id',
      // },{ onDelete: 'CASCADE' });
    }
  }
  User.init({
    factoryName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mobile: DataTypes.STRING,
    phone: DataTypes.STRING,
    address: DataTypes.STRING,
    expirationDate: DataTypes.STRING,
    dedicatedIp: DataTypes.STRING,
    status: DataTypes.STRING,
    numberOfFilledForms: DataTypes.INTEGER,
    numberOfExaminedPersonnels: DataTypes.INTEGER,
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
    modelName: 'User',
  });

  paginate.paginate(User);
  return User;
};