const mysql = require('mysql2');

console.log("Attempting direct connection to MySQL...");

const connection = mysql.createConnection({
  host: '127.0.0.1', // Using 127.0.0.1 instead of localhost avoids socket issues
  user: 'root',
  password: '21@TTAJsnj',
  // database: 'workflow_db' // We won't select the DB yet, just checking credentials
});

connection.connect((err) => {
  if (err) {
    console.error('\n❌ Connection completely rejected by MySQL server:');
    console.error(err.message);
  } else {
    console.log('\n✅ Successfully Logged in!');
    connection.query("SHOW DATABASES;", (err, results) => {
        if (err) console.error("Could not fetch databases:", err);
        else console.log("Available Databases:", results.map(r => Object.values(r)[0]));
        process.exit();
    });
  }
});
