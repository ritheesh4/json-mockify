const http = require("http");
const { handleRequest } = require("./requestHandler");

/**
 * Creates an HTTP server based on the provided configuration.
 * @param {string} configFilePath - The file path to the configuration file.
 */
const createServer = (configFilePath) => {
  /**
   * Configuration object containing server parameters.
   * @typedef {Object} ServerConfig
   * @property {string} [hostname="localhost"] - The hostname of the server.
   * @property {number} [port=3000] - The port number for the server.
   */

  /**
   * Handles HTTP requests and sends responses based on the provided configuration.
   * @param {http.IncomingMessage} req - The HTTP request object.
   * @param {http.ServerResponse} res - The HTTP response object.
   * @param {ServerConfig} config - The server configuration.
   */
  const serverRequestHandler = (req, res) => {
    // Set CORS headers to allow all origins
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "*");

    // Check if it's a preflight request (OPTIONS) and respond with 200 OK
    if (req.method === "OPTIONS") {
      res.writeHead(200);
      res.end();
      return;
    }

    // Handle the request
    handleRequest(req, res, config);
  };

  // Load configuration from the specified file path
  const config = require(configFilePath);

  // Extract hostname and port from the configuration, defaulting to "localhost" and 3000 if not provided
  const { hostname = "localhost", port = 3000 } = config;

  // Create an HTTP server using the request handler function
  const server = http.createServer(serverRequestHandler);

  // Start the server and log a message indicating where it's running
  server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
  });
};

module.exports = { createServer };
