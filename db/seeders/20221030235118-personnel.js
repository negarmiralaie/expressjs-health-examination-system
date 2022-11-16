'use strict';
const { sequelize } = require('../models');
const { Helper } = require('../../components/helper');


module.exports = {
  up: async (queryInterface, Sequelize) => {
    const personnel = [];
    personnel.push({
      factoryName: "factoryName1",
      examinationType: "موردی",
      date: "1401-09-01",
      fileNo: "fileNo1",
      personalNo: "298878",
      fullName: "fullName1",
      fatherName: "fatherName1",
      gender: "زن",
      maritalStatus: "مجرد",
      childrenNumber: "0",
      birthYear: "1362-01-09",
      SSN: "12135988",
      militaryStatus: "سپاه",
      serviceLine: "زرهی",
      description: "description1",
      createdAt: '2022-10-30T14:02:44.506Z',
      updatedAt: '2022-10-30T14:02:44.507Z'
    });

    try {
      await queryInterface.bulkInsert('Personnels', personnel, {});
      sequelize.query(
        `ALTER SEQUENCE "${'Personnels'}_id_seq" RESTART WITH ${
          personnel.length + 1
        }`
      );
    } catch (err) {
      console.log(err);
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Personnels', null, {});
  },
};
