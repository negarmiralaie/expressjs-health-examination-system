const Sequelize = require("sequelize");

/**
 * Actions summary:
 *
 * changeColumn(factory_id) => "Cases"
 * changeColumn(examined_id) => "Harmfulfactors"
 * changeColumn(examiner_id) => "Harmfulfactors"
 * changeColumn(examined_id) => "HealthInfos"
 * changeColumn(examiner_id) => "HealthInfos"
 * changeColumn(examined_id) => "Optometryaudiometries"
 * changeColumn(examiner_id) => "Optometryaudiometries"
 * changeColumn(factory_id) => "Personnels"
 * changeColumn(examined_id) => "SpirometryEcgs"
 * changeColumn(examiner_id) => "SpirometryEcgs"
 * changeColumn(user_id) => "Sugguestions"
 * changeColumn(examined_id) => "TestExaminations"
 * changeColumn(examiner_id) => "TestExaminations"
 * changeColumn(factory_id) => "Users"
 *
 */

const info = {
  revision: 2,
  name: "migration75",
  created: "2022-11-02T14:36:30.846Z",
  comment: "",
};

const migrationCommands = (transaction) => [
  {
    fn: "changeColumn",
    params: [
      "Cases",
      "factory_id",
      {
        type: Sequelize.INTEGER,
        onUpdate: "CASCADE",
        onDelete: "NO ACTION",
        references: { model: "Factories", key: "id" },
        field: "factory_id",
        allowNull: false,
      },
      { transaction },
    ],
  },
  {
    fn: "changeColumn",
    params: [
      "Harmfulfactors",
      "examined_id",
      {
        type: Sequelize.INTEGER,
        onUpdate: "CASCADE",
        onDelete: "NO ACTION",
        references: { model: "Users", key: "id" },
        allowNull: true,
        field: "examined_id",
      },
      { transaction },
    ],
  },
  {
    fn: "changeColumn",
    params: [
      "Harmfulfactors",
      "examiner_id",
      {
        type: Sequelize.INTEGER,
        onUpdate: "CASCADE",
        onDelete: "NO ACTION",
        references: { model: "Users", key: "id" },
        allowNull: true,
        field: "examiner_id",
      },
      { transaction },
    ],
  },
  {
    fn: "changeColumn",
    params: [
      "HealthInfos",
      "examined_id",
      {
        type: Sequelize.INTEGER,
        onUpdate: "CASCADE",
        onDelete: "NO ACTION",
        references: { model: "Users", key: "id" },
        allowNull: true,
        field: "examined_id",
      },
      { transaction },
    ],
  },
  {
    fn: "changeColumn",
    params: [
      "HealthInfos",
      "examiner_id",
      {
        type: Sequelize.INTEGER,
        onUpdate: "CASCADE",
        onDelete: "NO ACTION",
        references: { model: "Users", key: "id" },
        allowNull: true,
        field: "examiner_id",
      },
      { transaction },
    ],
  },
  {
    fn: "changeColumn",
    params: [
      "Optometryaudiometries",
      "examined_id",
      {
        type: Sequelize.INTEGER,
        onUpdate: "CASCADE",
        onDelete: "NO ACTION",
        references: { model: "Users", key: "id" },
        allowNull: true,
        field: "examined_id",
      },
      { transaction },
    ],
  },
  {
    fn: "changeColumn",
    params: [
      "Optometryaudiometries",
      "examiner_id",
      {
        type: Sequelize.INTEGER,
        onUpdate: "CASCADE",
        onDelete: "NO ACTION",
        references: { model: "Users", key: "id" },
        allowNull: true,
        field: "examiner_id",
      },
      { transaction },
    ],
  },
  {
    fn: "changeColumn",
    params: [
      "Personnels",
      "factory_id",
      {
        type: Sequelize.INTEGER,
        field: "factory_id",
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
        references: { model: "Factories", key: "id" },
        allowNull: true,
      },
      { transaction },
    ],
  },
  {
    fn: "changeColumn",
    params: [
      "SpirometryEcgs",
      "examined_id",
      {
        type: Sequelize.INTEGER,
        onUpdate: "CASCADE",
        onDelete: "NO ACTION",
        references: { model: "Users", key: "id" },
        allowNull: true,
        field: "examined_id",
      },
      { transaction },
    ],
  },
  {
    fn: "changeColumn",
    params: [
      "SpirometryEcgs",
      "examiner_id",
      {
        type: Sequelize.INTEGER,
        onUpdate: "CASCADE",
        onDelete: "NO ACTION",
        references: { model: "Users", key: "id" },
        allowNull: true,
        field: "examiner_id",
      },
      { transaction },
    ],
  },
  {
    fn: "changeColumn",
    params: [
      "Sugguestions",
      "user_id",
      {
        type: Sequelize.INTEGER,
        onUpdate: "CASCADE",
        onDelete: "NO ACTION",
        references: { model: "Users", key: "id" },
        allowNull: true,
        field: "user_id",
      },
      { transaction },
    ],
  },
  {
    fn: "changeColumn",
    params: [
      "TestExaminations",
      "examined_id",
      {
        type: Sequelize.INTEGER,
        onUpdate: "CASCADE",
        onDelete: "NO ACTION",
        references: { model: "Users", key: "id" },
        allowNull: true,
        field: "examined_id",
      },
      { transaction },
    ],
  },
  {
    fn: "changeColumn",
    params: [
      "TestExaminations",
      "examiner_id",
      {
        type: Sequelize.INTEGER,
        onUpdate: "CASCADE",
        onDelete: "NO ACTION",
        references: { model: "Users", key: "id" },
        allowNull: true,
        field: "examiner_id",
      },
      { transaction },
    ],
  },
  {
    fn: "changeColumn",
    params: [
      "Users",
      "factory_id",
      {
        type: Sequelize.INTEGER,
        field: "factory_id",
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
        references: { model: "Factories", key: "id" },
        allowNull: true,
      },
      { transaction },
    ],
  },
];

const rollbackCommands = (transaction) => [
  {
    fn: "changeColumn",
    params: [
      "Cases",
      "factory_id",
      {
        type: Sequelize.INTEGER,
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        references: { model: "Factories", key: "id" },
        field: "factory_id",
        allowNull: false,
      },
      { transaction },
    ],
  },
  {
    fn: "changeColumn",
    params: [
      "Harmfulfactors",
      "examined_id",
      {
        type: Sequelize.INTEGER,
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        references: { model: "Users", key: "id" },
        allowNull: true,
        field: "examined_id",
      },
      { transaction },
    ],
  },
  {
    fn: "changeColumn",
    params: [
      "Harmfulfactors",
      "examiner_id",
      {
        type: Sequelize.INTEGER,
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        references: { model: "Users", key: "id" },
        allowNull: true,
        field: "examiner_id",
      },
      { transaction },
    ],
  },
  {
    fn: "changeColumn",
    params: [
      "HealthInfos",
      "examined_id",
      {
        type: Sequelize.INTEGER,
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        references: { model: "Users", key: "id" },
        allowNull: true,
        field: "examined_id",
      },
      { transaction },
    ],
  },
  {
    fn: "changeColumn",
    params: [
      "HealthInfos",
      "examiner_id",
      {
        type: Sequelize.INTEGER,
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        references: { model: "Users", key: "id" },
        allowNull: true,
        field: "examiner_id",
      },
      { transaction },
    ],
  },
  {
    fn: "changeColumn",
    params: [
      "Optometryaudiometries",
      "examined_id",
      {
        type: Sequelize.INTEGER,
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        references: { model: "Users", key: "id" },
        allowNull: true,
        field: "examined_id",
      },
      { transaction },
    ],
  },
  {
    fn: "changeColumn",
    params: [
      "Optometryaudiometries",
      "examiner_id",
      {
        type: Sequelize.INTEGER,
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        references: { model: "Users", key: "id" },
        allowNull: true,
        field: "examiner_id",
      },
      { transaction },
    ],
  },
  {
    fn: "changeColumn",
    params: [
      "Personnels",
      "factory_id",
      {
        type: Sequelize.INTEGER,
        field: "factory_id",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        references: { model: "Factories", key: "id" },
        allowNull: true,
      },
      { transaction },
    ],
  },
  {
    fn: "changeColumn",
    params: [
      "SpirometryEcgs",
      "examined_id",
      {
        type: Sequelize.INTEGER,
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        references: { model: "Users", key: "id" },
        allowNull: true,
        field: "examined_id",
      },
      { transaction },
    ],
  },
  {
    fn: "changeColumn",
    params: [
      "SpirometryEcgs",
      "examiner_id",
      {
        type: Sequelize.INTEGER,
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        references: { model: "Users", key: "id" },
        allowNull: true,
        field: "examiner_id",
      },
      { transaction },
    ],
  },
  {
    fn: "changeColumn",
    params: [
      "Sugguestions",
      "user_id",
      {
        type: Sequelize.INTEGER,
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        references: { model: "Users", key: "id" },
        allowNull: true,
        field: "user_id",
      },
      { transaction },
    ],
  },
  {
    fn: "changeColumn",
    params: [
      "TestExaminations",
      "examined_id",
      {
        type: Sequelize.INTEGER,
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        references: { model: "Users", key: "id" },
        allowNull: true,
        field: "examined_id",
      },
      { transaction },
    ],
  },
  {
    fn: "changeColumn",
    params: [
      "TestExaminations",
      "examiner_id",
      {
        type: Sequelize.INTEGER,
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        references: { model: "Users", key: "id" },
        allowNull: true,
        field: "examiner_id",
      },
      { transaction },
    ],
  },
  {
    fn: "changeColumn",
    params: [
      "Users",
      "factory_id",
      {
        type: Sequelize.INTEGER,
        field: "factory_id",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        references: { model: "Factories", key: "id" },
        allowNull: true,
      },
      { transaction },
    ],
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
