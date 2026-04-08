const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const WorkflowStage = sequelize.define('WorkflowStage', {
  stage_level: {
    type: DataTypes.INTEGER,
    allowNull: false // e.g., 1
  },
  stage_name: {
    type: DataTypes.STRING,
    allowNull: false // e.g., "Manager Review"
  },
  required_role: {
    type: DataTypes.STRING,
    allowNull: false // e.g., "manager"
  }
}, {
  tableName: 'workflow_stages'
});

module.exports = WorkflowStage;
