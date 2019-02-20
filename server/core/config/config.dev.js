// import path from 'path';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig();

const config = {};

// config.logFileDir = path.join(__dirname, '../../log');
// config.logFileName = 'app.log';
config.dbHost = process.env.dbHost || 'localhost';
config.dbPort = process.env.dbPort || '27017';
config.dbName = process.env.dbName || 'restaurants';
config.dbUser = process.env.dbUser || 'root';
config.dbPassword = process.env.dbPassword || '';

config.serverHost = process.env.serverHost || '0.0.0.0';
config.serverPort = process.env.serverPort || 8000;

config.SALT_WORK_FACTOR = process.env.SALT_WORK_FACTOR || 10;
config.JWT_SECRET = process.env.JWT_SECRET || 'JWT_SECRET';

config.FROM_EMAIL = process.env.emailUser
config.EMAIL_PASSWORD = process.env.emailPassword

export default config;
