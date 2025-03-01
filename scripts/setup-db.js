const { execSync } = require('child_process');
const path = require('path');

// Function to execute shell commands
function runCommand(command) {
  try {
    console.log(`Running: ${command}`);
    execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error(`Error executing command: ${command}`);
    console.error(error);
    process.exit(1);
  }
}

// Main function
async function main() {
  console.log('Setting up database...');

  // Run Prisma migrations
  runCommand('npx prisma migrate dev --name init');

  // Seed the database
  runCommand('npx prisma db seed');

  console.log('Database setup completed successfully!');
}

main(); 