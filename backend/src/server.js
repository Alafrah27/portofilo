import dotenv from "dotenv";
import mongoose from "mongoose";
import { createApp } from "./app.js";
import { getConfig } from "./config.js";
import { User } from "./model/User.js";
import { Project } from "./model/Project.js";
import { Task } from "./model/Task.js";

dotenv.config({ quiet: true });

async function start(config) {
  await mongoose.connect(config.mongoUrl, {
    serverSelectionTimeoutMS: 10000,
    dbName: config.mongoDbName,
  });
  await User.init();
  await Project.init();
  await Task.init();
  const server = createApp(config).listen(config.port, (error) => {
    if (error) return;
    console.log(`Server is running on port ${config.port}`);
  });
  server.on("error", async () => {
    console.error("Could not start the HTTP server. Check PORT availability.");
    await mongoose.disconnect();
    process.exitCode = 1;
  });
  const shutdown = () => {
    const timeout = setTimeout(() => process.exit(1), 10000);
    timeout.unref();
    server.close(async () => {
      await mongoose.disconnect();
      clearTimeout(timeout);
    });
  };
  process.once("SIGINT", shutdown);
  process.once("SIGTERM", shutdown);
}

let config;
try {
  config = getConfig();
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}

if (config) {
  if (config.nodeEnv === 'production' && !config.adminOrigins.length) {
    console.warn('ADMIN_ORIGINS is unset. Public project reads are enabled; browser admin access is blocked until an exact dashboard origin is configured.');
  }
  start(config).catch(async () => {
    console.error(
      "Could not initialize MongoDB. Check MONGO_URL and database availability.",
    );
    await mongoose.disconnect();
    process.exitCode = 1;
  });
}
