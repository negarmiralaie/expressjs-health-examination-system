const Sequelize = require("sequelize");

/**
 * Actions summary:
 *
 * createTable() => "Bpms", deps: []
 * createTable() => "Factories", deps: []
 * createTable() => "Settings", deps: []
 * createTable() => "Cases", deps: [Factories]
 * createTable() => "Users", deps: [Factories]
 * createTable() => "Harmfulfactors", deps: [Users, Users]
 * createTable() => "HealthInfos", deps: [Users, Users]
 * createTable() => "Personnels", deps: [Factories]
 * createTable() => "Optometryaudiometries", deps: [Users, Users]
 * createTable() => "SpirometryEcgs", deps: [Users, Users]
 * createTable() => "Sugguestions", deps: [Users, Factories]
 * createTable() => "TestExaminations", deps: [Users, Users]
 *
 */

const info = {
  revision: 1,
  name: "migration74",
  created: "2022-11-01T03:10:19.177Z",
  comment: "",
};

const migrationCommands = (transaction) => [
  {
    fn: "createTable",
    params: [
      "Bpms",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        title: { type: Sequelize.STRING, field: "title" },
        showOnOrderList: {
          type: Sequelize.ARRAY(Sequelize.INTEGER),
          field: "showOnOrderList",
        },
        details: { type: Sequelize.ARRAY(Sequelize.INTEGER), field: "details" },
        changeStatusFrom: {
          type: Sequelize.ARRAY(Sequelize.INTEGER),
          field: "changeStatusFrom",
        },
        changeStatusTo: {
          type: Sequelize.ARRAY(Sequelize.INTEGER),
          field: "changeStatusTo",
        },
        edit: { type: Sequelize.JSONB, field: "edit" },
        createdAt: {
          type: Sequelize.DATE,
          field: "createdAt",
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          field: "updatedAt",
          allowNull: false,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "Factories",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        abbrvCode: {
          type: Sequelize.STRING,
          field: "abbrvCode",
          allowNull: false,
        },
        name: { type: Sequelize.STRING, field: "name", allowNull: false },
        mobile: { type: Sequelize.STRING, field: "mobile" },
        status: { type: Sequelize.STRING, field: "status", allowNull: false },
        numberOfPersonnels: {
          type: Sequelize.INTEGER,
          field: "numberOfPersonnels",
          defaultValue: 0,
        },
        numberOfCases: { type: Sequelize.INTEGER, field: "numberOfCases" },
        createdAt: {
          type: Sequelize.DATE,
          field: "createdAt",
          defaultValue: Sequelize.NOW,
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          field: "updatedAt",
          defaultValue: Sequelize.NOW,
          allowNull: false,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "Settings",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        factoryName: { type: Sequelize.STRING, field: "factoryName" },
        logoUrl: { type: Sequelize.STRING, field: "logoUrl" },
        loginPhotoUrl: { type: Sequelize.STRING, field: "loginPhotoUrl" },
        panelUsername: { type: Sequelize.STRING, field: "panelUsername" },
        panelPassword: { type: Sequelize.STRING, field: "panelPassword" },
        message: { type: Sequelize.STRING, field: "message" },
        createdAt: {
          type: Sequelize.DATE,
          field: "createdAt",
          defaultValue: Sequelize.NOW,
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          field: "updatedAt",
          defaultValue: Sequelize.NOW,
          allowNull: false,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "Cases",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        factory_id: {
          type: Sequelize.INTEGER,
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
          references: { model: "Factories", key: "id" },
          field: "factory_id",
          allowNull: false,
        },
        title: { type: Sequelize.STRING, field: "title", allowNull: false },
        fileUrl: { type: Sequelize.STRING, field: "fileUrl", allowNull: false },
        createdAt: {
          type: Sequelize.DATE,
          field: "createdAt",
          defaultValue: Sequelize.NOW,
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          field: "updatedAt",
          defaultValue: Sequelize.NOW,
          allowNull: false,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "Users",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        factoryName: {
          type: Sequelize.STRING,
          field: "factoryName",
          allowNull: false,
        },
        fullName: {
          type: Sequelize.STRING,
          field: "fullName",
          allowNull: false,
        },
        username: {
          type: Sequelize.STRING,
          field: "username",
          allowNull: false,
        },
        password: {
          type: Sequelize.STRING,
          field: "password",
          allowNull: false,
        },
        role: { type: Sequelize.STRING, field: "role", allowNull: false },
        email: { type: Sequelize.STRING, field: "email", allowNull: false },
        mobile: { type: Sequelize.STRING, field: "mobile" },
        phone: { type: Sequelize.STRING, field: "phone" },
        address: { type: Sequelize.STRING, field: "address" },
        expirationDate: { type: Sequelize.STRING, field: "expirationDate" },
        dedicatedIp: { type: Sequelize.STRING, field: "dedicatedIp" },
        status: { type: Sequelize.STRING, field: "status" },
        numberOfFilledForms: {
          type: Sequelize.INTEGER,
          field: "numberOfFilledForms",
        },
        numberOfExaminedPersonnels: {
          type: Sequelize.INTEGER,
          field: "numberOfExaminedPersonnels",
        },
        createdAt: {
          type: Sequelize.DATE,
          field: "createdAt",
          defaultValue: Sequelize.NOW,
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          field: "updatedAt",
          defaultValue: Sequelize.NOW,
          allowNull: false,
        },
        factory_id: {
          type: Sequelize.INTEGER,
          field: "factory_id",
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
          references: { model: "Factories", key: "id" },
          allowNull: true,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "Harmfulfactors",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        examiner_id: {
          type: Sequelize.INTEGER,
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
          references: { model: "Users", key: "id" },
          allowNull: true,
          field: "examiner_id",
        },
        examined_id: {
          type: Sequelize.INTEGER,
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
          references: { model: "Users", key: "id" },
          allowNull: true,
          field: "examined_id",
        },
        currentJobRole: { type: Sequelize.STRING, field: "currentJobRole" },
        currentJobDuty: { type: Sequelize.STRING, field: "currentJobDuty" },
        currentJobStartingdate: {
          type: Sequelize.STRING,
          field: "currentJobStartingdate",
        },
        resultDescription: { type: Sequelize.TEXT, field: "resultDescription" },
        healthExpertSuggestion: {
          type: Sequelize.ARRAY(Sequelize.STRING),
          field: "healthExpertSuggestion",
        },
        DiseaseBg: {
          type: Sequelize.ARRAY(Sequelize.STRING),
          field: "DiseaseBg",
        },
        description: { type: Sequelize.TEXT, field: "description" },
        height: { type: Sequelize.STRING, field: "height" },
        weight: { type: Sequelize.STRING, field: "weight" },
        bmi: { type: Sequelize.STRING, field: "bmi" },
        bmiStatus: { type: Sequelize.STRING, field: "bmiStatus" },
        createdAt: {
          type: Sequelize.DATE,
          field: "createdAt",
          defaultValue: Sequelize.NOW,
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          field: "updatedAt",
          defaultValue: Sequelize.NOW,
          allowNull: false,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "HealthInfos",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        examiner_id: {
          type: Sequelize.INTEGER,
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
          references: { model: "Users", key: "id" },
          allowNull: true,
          field: "examiner_id",
        },
        examined_id: {
          type: Sequelize.INTEGER,
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
          references: { model: "Users", key: "id" },
          allowNull: true,
          field: "examined_id",
        },
        currentJobRole: { type: Sequelize.STRING, field: "currentJobRole" },
        currentJobDuty: { type: Sequelize.STRING, field: "currentJobDuty" },
        currentJobStartingdate: {
          type: Sequelize.STRING,
          field: "currentJobStartingdate",
        },
        resultDescription: { type: Sequelize.TEXT, field: "resultDescription" },
        healthExpertSuggestion: {
          type: Sequelize.ARRAY(Sequelize.STRING),
          field: "healthExpertSuggestion",
        },
        diseaseBg: {
          type: Sequelize.ARRAY(Sequelize.STRING),
          field: "diseaseBg",
        },
        diseaseBgDescription: {
          type: Sequelize.TEXT,
          field: "diseaseBgDescription",
        },
        height: { type: Sequelize.STRING, field: "height" },
        weight: { type: Sequelize.STRING, field: "weight" },
        bmi: { type: Sequelize.STRING, field: "bmi" },
        bmiStatus: { type: Sequelize.STRING, field: "bmiStatus" },
        bloodPressure: { type: Sequelize.STRING, field: "bloodPressure" },
        pulsePerMinute: { type: Sequelize.STRING, field: "pulsePerMinute" },
        testResults: {
          type: Sequelize.ARRAY(Sequelize.STRING),
          field: "testResults",
        },
        testDescription: { type: Sequelize.TEXT, field: "testDescription" },
        examinationDescription: {
          type: Sequelize.ARRAY(Sequelize.STRING),
          field: "examinationDescription",
        },
        rightEyeVisualAcuity: {
          type: Sequelize.STRING,
          field: "rightEyeVisualAcuity",
        },
        leftEyeVisualAcuity: {
          type: Sequelize.STRING,
          field: "leftEyeVisualAcuity",
        },
        colorVision: { type: Sequelize.STRING, field: "colorVision" },
        visualField: { type: Sequelize.STRING, field: "visualField" },
        depthVision: { type: Sequelize.STRING, field: "depthVision" },
        optometryDescription: {
          type: Sequelize.TEXT,
          field: "optometryDescription",
        },
        rightEarCondition: {
          type: Sequelize.STRING,
          field: "rightEarCondition",
        },
        leftEarCondition: { type: Sequelize.STRING, field: "leftEarCondition" },
        audiometryDescription: {
          type: Sequelize.TEXT,
          field: "audiometryDescription",
        },
        spiro: { type: Sequelize.STRING, field: "spiro" },
        spirometryDescription: {
          type: Sequelize.TEXT,
          field: "spirometryDescription",
        },
        ecg: { type: Sequelize.STRING, field: "ecg" },
        ecgDescription: { type: Sequelize.TEXT, field: "ecgDescription" },
        medicineExpertSuggest: {
          type: Sequelize.TEXT,
          field: "medicineExpertSuggest",
        },
        medicalAdvice: {
          type: Sequelize.ARRAY(Sequelize.STRING),
          field: "medicalAdvice",
        },
        medicalAdviceDescription: {
          type: Sequelize.TEXT,
          field: "medicalAdviceDescription",
        },
        createdAt: {
          type: Sequelize.DATE,
          field: "createdAt",
          defaultValue: Sequelize.NOW,
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          field: "updatedAt",
          defaultValue: Sequelize.NOW,
          allowNull: false,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "Personnels",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        factoryName: { type: Sequelize.STRING, field: "factoryName" },
        examinationType: { type: Sequelize.STRING, field: "examinationType" },
        date: { type: Sequelize.STRING, field: "date" },
        fileNo: { type: Sequelize.STRING, field: "fileNo" },
        personalNo: { type: Sequelize.STRING, field: "personalNo" },
        fullName: { type: Sequelize.STRING, field: "fullName" },
        fatherName: { type: Sequelize.STRING, field: "fatherName" },
        gender: { type: Sequelize.STRING, field: "gender" },
        maritalStatus: { type: Sequelize.STRING, field: "maritalStatus" },
        childrenNumber: { type: Sequelize.STRING, field: "childrenNumber" },
        birthYear: { type: Sequelize.STRING, field: "birthYear" },
        SSN: { type: Sequelize.STRING, field: "SSN" },
        militaryStatus: { type: Sequelize.STRING, field: "militaryStatus" },
        serviceLine: { type: Sequelize.STRING, field: "serviceLine" },
        description: { type: Sequelize.STRING, field: "description" },
        status: { type: Sequelize.STRING, field: "status" },
        createdAt: {
          type: Sequelize.DATE,
          field: "createdAt",
          defaultValue: Sequelize.NOW,
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          field: "updatedAt",
          defaultValue: Sequelize.NOW,
          allowNull: false,
        },
        factory_id: {
          type: Sequelize.INTEGER,
          field: "factory_id",
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
          references: { model: "Factories", key: "id" },
          allowNull: true,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "Optometryaudiometries",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        examiner_id: {
          type: Sequelize.INTEGER,
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
          references: { model: "Users", key: "id" },
          allowNull: true,
          field: "examiner_id",
        },
        examined_id: {
          type: Sequelize.INTEGER,
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
          references: { model: "Users", key: "id" },
          allowNull: true,
          field: "examined_id",
        },
        rightEyeVisualAcuity: {
          type: Sequelize.STRING,
          field: "rightEyeVisualAcuity",
        },
        leftEyeVisualAcuity: {
          type: Sequelize.STRING,
          field: "leftEyeVisualAcuity",
        },
        colorVision: { type: Sequelize.STRING, field: "colorVision" },
        visualField: { type: Sequelize.STRING, field: "visualField" },
        depthVision: { type: Sequelize.STRING, field: "depthVision" },
        optometryDescription: {
          type: Sequelize.TEXT,
          field: "optometryDescription",
        },
        rightEarCondition: {
          type: Sequelize.STRING,
          field: "rightEarCondition",
        },
        leftEarCondition: { type: Sequelize.STRING, field: "leftEarCondition" },
        audiometryDescription: {
          type: Sequelize.TEXT,
          field: "audiometryDescription",
        },
        createdAt: {
          type: Sequelize.DATE,
          field: "createdAt",
          defaultValue: Sequelize.NOW,
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          field: "updatedAt",
          defaultValue: Sequelize.NOW,
          allowNull: false,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "SpirometryEcgs",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        examiner_id: {
          type: Sequelize.INTEGER,
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
          references: { model: "Users", key: "id" },
          allowNull: true,
          field: "examiner_id",
        },
        examined_id: {
          type: Sequelize.INTEGER,
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
          references: { model: "Users", key: "id" },
          allowNull: true,
          field: "examined_id",
        },
        spiro: { type: Sequelize.STRING, field: "spiro" },
        spirometryDescription: {
          type: Sequelize.STRING,
          field: "spirometryDescription",
        },
        ecg: { type: Sequelize.STRING, field: "ecg" },
        ecgDescription: { type: Sequelize.STRING, field: "ecgDescription" },
        medicineExpertSuggest: {
          type: Sequelize.STRING,
          field: "medicineExpertSuggest",
        },
        medicalAdvice: {
          type: Sequelize.ARRAY(Sequelize.STRING),
          field: "medicalAdvice",
        },
        description: { type: Sequelize.STRING, field: "description" },
        createdAt: {
          type: Sequelize.DATE,
          field: "createdAt",
          defaultValue: Sequelize.NOW,
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          field: "updatedAt",
          defaultValue: Sequelize.NOW,
          allowNull: false,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "Sugguestions",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        user_id: {
          type: Sequelize.INTEGER,
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
          references: { model: "Users", key: "id" },
          allowNull: true,
          field: "user_id",
        },
        factory_id: {
          type: Sequelize.INTEGER,
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
          references: { model: "Factories", key: "id" },
          allowNull: true,
          field: "factory_id",
        },
        title: { type: Sequelize.STRING, field: "title", allowNull: false },
        description: {
          type: Sequelize.TEXT,
          field: "description",
          allowNull: false,
        },
        createdAt: {
          type: Sequelize.DATE,
          field: "createdAt",
          defaultValue: Sequelize.NOW,
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          field: "updatedAt",
          defaultValue: Sequelize.NOW,
          allowNull: false,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "TestExaminations",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        examiner_id: {
          type: Sequelize.INTEGER,
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
          references: { model: "Users", key: "id" },
          allowNull: true,
          field: "examiner_id",
        },
        examined_id: {
          type: Sequelize.INTEGER,
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
          references: { model: "Users", key: "id" },
          allowNull: true,
          field: "examined_id",
        },
        bloodPressure: { type: Sequelize.STRING, field: "bloodPressure" },
        pulsePerMinute: { type: Sequelize.STRING, field: "pulsePerMinute" },
        testResults: {
          type: Sequelize.ARRAY(Sequelize.STRING),
          field: "testResults",
        },
        testDescription: { type: Sequelize.TEXT, field: "testDescription" },
        examinationDescription: {
          type: Sequelize.ARRAY(Sequelize.STRING),
          field: "examinationDescription",
        },
        createdAt: {
          type: Sequelize.DATE,
          field: "createdAt",
          defaultValue: Sequelize.NOW,
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          field: "updatedAt",
          defaultValue: Sequelize.NOW,
          allowNull: false,
        },
      },
      { transaction },
    ],
  },
];

const rollbackCommands = (transaction) => [
  {
    fn: "dropTable",
    params: ["Bpms", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["Cases", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["Factories", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["Harmfulfactors", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["HealthInfos", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["Optometryaudiometries", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["Personnels", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["Settings", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["SpirometryEcgs", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["Sugguestions", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["TestExaminations", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["Users", { transaction }],
  },
];

const pos = 0;
const useTransaction = true;

const execute = (queryInterface, sequelize, _commands) => {
  let index = pos;
  const run = (transaction) => {
    const commands = _commands(transaction);
    return new Promise((resolve, reject) => {
      const next = () => {
        if (index < commands.length) {
          const command = commands[index];
          console.log(`[#${index}] execute: ${command.fn}`);
          index++;
          queryInterface[command.fn](...command.params).then(next, reject);
        } else resolve();
      };
      next();
    });
  };
  if (useTransaction) return queryInterface.sequelize.transaction(run);
  return run(null);
};

module.exports = {
  pos,
  useTransaction,
  up: (queryInterface, sequelize) =>
    execute(queryInterface, sequelize, migrationCommands),
  down: (queryInterface, sequelize) =>
    execute(queryInterface, sequelize, rollbackCommands),
  info,
};
