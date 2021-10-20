const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const ENV = process.env.ENV || 'development';
const envConfig = require(path.resolve(__dirname, 'environments', ENV));

// General config
const config = { ...envConfig, env: ENV };

module.exports = { config };
