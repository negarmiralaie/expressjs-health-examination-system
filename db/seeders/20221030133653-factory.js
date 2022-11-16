'use strict';
const { sequelize } = require('../models');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const factory = [];
    factory.push({
      abbrvCode: 'mrc',
      name: 'factoryName1',
      mobile: '09888837652',
      status: 'active',
      createdAt: '2022-10-30T14:02:43.506Z',
      updatedAt: '2022-10-30T14:02:43.507Z'
    });

    try {
      await queryInterface.bulkInsert('Factories', factory, {});
      sequelize.query(
        `ALTER SEQUENCE "${'Factories'}_id_seq" RESTART WITH ${
          factory.length + 1
        }`
      );
    } catch (err) {
      console.log(err);
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Factories', null, {});
  },
};
