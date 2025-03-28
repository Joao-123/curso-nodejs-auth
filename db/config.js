const { config } = require('./../config/config');

module.exports = {
  development: {
    dialect: 'mysql',
    host: config.dbHost,
    username: config.dbUser,
    password: config.dbPassword,
    database: config.dbName,
    dialectModule: require('mysql2'),
    logging: true,
  },
  production: {
    url: config.dbUrl,
    dialect: 'mysql',
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false
      }
    },
    dialectModule: require('mysql2'),
  }
}
