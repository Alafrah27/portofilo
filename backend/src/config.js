export function getConfig(env = process.env) {
  const nodeEnv = env.NODE_ENV || 'development';
  if (!['development', 'test', 'production'].includes(nodeEnv)) {
    throw new Error('NODE_ENV must be development, test, or production.');
  }
  if (!env.MONGO_URL || !/^mongodb(?:\+srv)?:\/\//.test(env.MONGO_URL)) {
    throw new Error('MONGO_URL must be a MongoDB connection string.');
  }
  if (env.MONGO_DB_NAME && ['admin', 'local', 'config'].includes(env.MONGO_DB_NAME)) {
    throw new Error('MONGO_DB_NAME must be an application database, not a MongoDB system database.');
  }
  for (const name of ['JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET']) {
    if (!env[name] || Buffer.byteLength(env[name], 'utf8') < 32) {
      throw new Error(`${name} must contain at least 32 bytes.`);
    }
  }
  if (env.JWT_ACCESS_SECRET === env.JWT_REFRESH_SECRET) {
    throw new Error('Access and refresh secrets must be different.');
  }
  // A public-only deployment may start before the admin dashboard is deployed.
  // Never trust development origins implicitly in production.
  const configuredOrigins = env.ADMIN_ORIGINS?.trim();
  const adminOrigins = (configuredOrigins || (nodeEnv === 'production' ? '' : 'http://localhost:5173,http://127.0.0.1:5173'))
    .split(',').map((origin) => origin.trim()).filter(Boolean);
  if (configuredOrigins && !adminOrigins.length) throw new Error('At least one admin origin is required.');
  for (const origin of adminOrigins) {
    let parsed;
    try { parsed = new URL(origin); } catch { throw new Error('ADMIN_ORIGINS contains an invalid origin.'); }
    if (!['http:', 'https:'].includes(parsed.protocol) || parsed.origin !== origin) {
      throw new Error('ADMIN_ORIGINS must contain exact HTTP(S) origins without paths.');
    }
  }
  const port = Number(env.PORT || 5000);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('PORT must be between 1 and 65535.');
  return {
    nodeEnv, port, adminOrigins,
    mongoUrl: env.MONGO_URL,
    mongoDbName: env.MONGO_DB_NAME || undefined,
    accessSecret: env.JWT_ACCESS_SECRET,
    refreshSecret: env.JWT_REFRESH_SECRET,
    cloudinary: {
      cloudName: env.CLOUDINARY_CLOUD_NAME,
      apiKey: env.CLOUDINARY_API_KEY,
      apiSecret: env.CLOUDINARY_API_SECRET,
    },
  };
}
