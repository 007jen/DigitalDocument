const sequelize = require('../config/db');
const User = require('./user');
const Document = require('./document');
const AuditLog = require('./auditLog');
const Notification = require('./notification');
const WorkflowStage = require('./workflowStage');

// Establish Relationships

// A User can have many Documents
User.hasMany(Document, { foreignKey: 'employee_id' });
Document.belongsTo(User, { foreignKey: 'employee_id' });

// An AuditLog belongs to a Document and a User
Document.hasMany(AuditLog, { foreignKey: 'document_id' });
AuditLog.belongsTo(Document, { foreignKey: 'document_id' });

User.hasMany(AuditLog, { foreignKey: 'user_id' });
AuditLog.belongsTo(User, { foreignKey: 'user_id' });

// A Notification belongs to a User
User.hasMany(Notification, { foreignKey: 'user_id' });
Notification.belongsTo(User, { foreignKey: 'user_id' });

// Export everything along with the connection instance
module.exports = {
  sequelize,
  User,
  Document,
  AuditLog,
  Notification,
  WorkflowStage
};
