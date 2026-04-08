const { sequelize } = require('./models');

async function migrate() {
  try {
    console.log("Synchronizing Database Schema (Alter Mode)...");
    await sequelize.sync({ alter: true });
    console.log("✅ Database schema updated successfully without losing data.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

migrate();
