const createServer = require('./index');

// Provide the path to the custom configuration file
const customConfigPath = '../defaultConfig.json';

// Create server with custom configuration
createServer(customConfigPath);
