const { existsSync } = require('node:fs');
const { join } = require('node:path');

const rutaEnv = join(__dirname, '.env');
if (existsSync(rutaEnv)) process.loadEnvFile(rutaEnv);

module.exports = process.env;
