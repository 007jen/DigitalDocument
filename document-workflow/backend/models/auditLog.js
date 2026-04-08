const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const AuditLog = sequelize.define('AuditLog', {
  document_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  action: {
    type: DataTypes.STRING, // e.g. "Uploaded", "Approved", "Rejected"
    allowNull: false
  },
  details: {
    type: DataTypes.TEXT, // Optional notes or stage info
    allowNull: true
  }
}, {
  tableName: 'audit_logs'
});

module.exports = AuditLog;
