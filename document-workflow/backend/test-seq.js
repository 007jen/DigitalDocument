const sequelize = require('./config/db');
const User = require('./models/user');

async function test() {
  try {
    const users = await User.findAll();
    console.log("Users:", users);
  } catch (e) {
    console.error("Failed", e);
  }
  process.exit();
}

test();
