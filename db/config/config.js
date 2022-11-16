const dotenv = require('dotenv');

dotenv.config();
module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: 'root',
    database: 'tebkar_db',
    host: process.env.DB_HOSTNAME,
    port: '5432',
    pool: {
      max: 20,
      min: 2,
      acquire: 30000,
      idle: 10000,
    },
    dialect: 'postgres',
    logging: console.log,
  },
  // test: {
  //   username: process.env.CI_DB_USERNAME,
  //   password: process.env.CI_DB_PASSWORD,
  //   database: process.env.CI_DB_NAME,
  //   host: process.env.CI_DB_HOST,
  //   port: process.env.CI_DB_PORT,
  //   pool: {
  //     max: 20,
  //     min: 2,
  //     acquire: 30000,
  //     idle: 10000,
  //   },
  //   dialect: 'postgres',
  // },
  production: {
    username: 'root',
    password: process.env.DB_PASSWORD,
    database: 'tebkar_db',
    host: process.env.DB_HOSTNAME,
    port: '5432',
    pool: {
      max: 20,
      min: 2,
      acquire: 30000,
      idle: 10000,
    },
    dialect: 'postgres',
  },
};
