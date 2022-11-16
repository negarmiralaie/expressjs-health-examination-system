'use strict';
const { sequelize } = require('../models');
const { Helper } = require('../../components/helper');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const user = [];
    user.push({
      factoryName: "factoryName1",
      fullName: "fullName1",
      username: "username1",
      password: await Helper.Hash("password1"),
      role: "ادمین",
      email: "email1@gmail.com",
      mobile: "9545338439",
      phone: "24415470",
      address: "address1",
      expirationDate: "1401-09-21",
      dedicatedIp: "12.12.12.14",
      status: "active",
      numberOfExaminedPersonnels: 0,
      numberOfFilledForms: 0,
      // factory_id: 1,
      createdAt: '2022-10-30T14:02:43.506Z',
      updatedAt: '2022-10-30T14:02:43.507Z'
    });

    user.push({
      // id: 5,
      factoryName: "factoryName1",
      fullName: "fullName2",
      username: "username2",
      password: await Helper.Hash("password2"),
      role: "مشتری",
      email: "email2@gmail.com",
      mobile: "9381238132",
      phone: "23213342",
      address: "address2",
      expirationDate: "1401-08-20",
      dedicatedIp: "12.12.12.12",
      status: "inactive",
      numberOfExaminedPersonnels: 0,
      numberOfFilledForms: 0,
      // factory_id: 1,
      createdAt: '2022-10-30T14:02:44.506Z',
      updatedAt: '2022-10-30T14:02:44.507Z'
    });

    try {
      await queryInterface.bulkInsert('Users', user, {});
      sequelize.query(
        `ALTER SEQUENCE "${'Users'}_id_seq" RESTART WITH ${
          user.length + 1
        }`
      );
    } catch (err) {
      console.log(err);
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
  },
};
