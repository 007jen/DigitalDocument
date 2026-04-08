const { Sequelize } = require('sequelize');
require('dotenv').config(); // loads .env

const sequelize = new Sequelize(
  process.env.DB_NAME,       // workflow_db
  process.env.DB_USER,       // root
  process.env.DB_PASSWORD,   // your password
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: false
  }
);

sequelize.authenticate()
  .then(() => console.log('✅ MySQL Connected'))
  .catch(err => console.error('❌ DB Error:', err));

module.exports = sequelize;