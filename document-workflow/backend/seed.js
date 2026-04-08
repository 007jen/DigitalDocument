const bcrypt = require('bcryptjs');
require('dotenv').config();
const { sequelize, User, WorkflowStage } = require('./models');

async function seed() {
  try {
    // 1. Recreate ALL tables (forces drop)
    await sequelize.sync({ force: true });
    console.log("✅ All tables created/reset!");

    // 2. Encrypt passwords
    const password = await bcrypt.hash('123456', 10);

    // 3. Create three user accounts
    await User.bulkCreate([
      { username: 'Admin User', email: 'admin@test.com', password: password, role: 'admin' },
      { username: 'Manager User', email: 'manager@test.com', password: password, role: 'manager' },
      { username: 'Employee User', email: 'employee@test.com', password: password, role: 'employee' }
    ]);
    console.log("✅ Successfully created test users!");

    // 4. Create default workflow stages
    await WorkflowStage.bulkCreate([
      { stage_level: 1, stage_name: "Manager Review", required_role: "manager" },
      { stage_level: 2, stage_name: "Finance Review", required_role: "finance" },
      { stage_level: 3, stage_name: "Final Admin Approval", required_role: "admin" }
    ]);
    console.log("✅ Successfully created Workflow Stages!");

    process.exit();
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seed();
