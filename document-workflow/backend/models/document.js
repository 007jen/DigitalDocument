const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Document = sequelize.define('Document', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  filename: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'Pending'
  },
  employee_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  workflow_stage_id: {
    type: DataTypes.INTEGER,
    defaultValue: 1 // Defaults to stage 1
  }
}, {
  tableName: 'documents'
});

module.exports = Document;
