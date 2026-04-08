const bcrypt = require('bcryptjs');
require('dotenv').config();
const sequelize = require('./config/db');
const User = require('./models/user');

async function seed() {
  try {
    // 1. Create the Users table if it doesn't already exist
    await sequelize.sync({ force: true }); // force true recreates the table to start fresh
    console.log("✅ Users table created/reset!");

    // 2. Encrypt passwords
    const password = await bcrypt.hash('123456', 10);

    // 3. Create three user accounts
    await User.bulkCreate([
      { username: 'Admin User', email: 'admin@test.com', password: password, role: 'admin' },
      { username: 'Manager User', email: 'manager@test.com', password: password, role: 'manager' },
      { username: 'Employee User', email: 'employee@test.com', password: password, role: 'employee' }
    ]);

    console.log("✅ Successfully created test users!");
    process.exit();
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seed();
