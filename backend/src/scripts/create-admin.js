import dotenv from 'dotenv';
import mongoose from 'mongoose';
import readline from 'node:readline';
import { Writable } from 'node:stream';
import { User } from '../model/User.js';
import { AdminCreationError, createAdmin } from '../services/createAdmin.js';

dotenv.config({ quiet: true });

async function main() {
  if (!process.stdin.isTTY) throw new AdminCreationError('Run this command in an interactive terminal. Passwords are never accepted as command-line arguments.');
  if (!process.env.MONGO_URL) throw new AdminCreationError('MONGO_URL is required.');
  let hidden = false;
  const output = new Writable({ write(chunk, encoding, callback) {
    if (!hidden) process.stdout.write(chunk, encoding);
    callback();
  } });
  const prompt = readline.createInterface({ input: process.stdin, output, terminal: true });
  const ask = (label, secret = false) => new Promise((resolve) => {
    process.stdout.write(label);
    hidden = secret;
    prompt.question('', (answer) => {
      hidden = false;
      if (secret) process.stdout.write('\n');
      resolve(answer);
    });
  });
  prompt.on('SIGINT', () => { prompt.close(); process.stdout.write('\nCancelled.\n'); process.exit(130); });
  let email;
  let password;
  try {
    email = await ask('Admin email: ');
    password = await ask('Password (hidden): ', true);
    const confirmation = await ask('Confirm password (hidden): ', true);
    if (password !== confirmation) throw new AdminCreationError('Passwords do not match.');
  } finally {
    prompt.close();
  }
  await mongoose.connect(process.env.MONGO_URL, { serverSelectionTimeoutMS: 10000, dbName: process.env.MONGO_DB_NAME || undefined });
  await User.init();
  await createAdmin({ email, password });
  console.log('Admin account created.');
}

main().catch((error) => {
  console.error(error instanceof AdminCreationError ? error.message : 'Could not create the admin account. Check the database connection.');
  process.exitCode = 1;
}).finally(() => mongoose.disconnect());
