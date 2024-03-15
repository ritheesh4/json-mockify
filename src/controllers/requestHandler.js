// requestHandler.js
const fs = require("fs");
const url = require("url");
const { loadJsonData, findDataByPath } = require("./utils");

const handleGet = (req, res, data) => {
  if (!data) {
    res.statusCode = 404;
    res.end("Not Found");
    return;
  }
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(data));
};

/**
 * Handles incoming HTTP requests and routes them to appropriate handlers based on the request method and path.
 * @param {http.IncomingMessage} req - The HTTP request object.
 * @param {http.ServerResponse} res - The HTTP response object.
 * @param {object} config - The server configuration object.
 * @param {string} config.dbFilePath - The file path to the JSON database.
 */
const handleRequest = (req, res, config) => {
  /**
   * Parses the request URL and extracts the path and method.
   * @type {object}
   * @property {string} pathname - The path of the request URL.
   * @property {string} method - The HTTP request method (GET, POST, DELETE, etc.).
   */
  const reqUrl = url.parse(req.url, true);

  // Extract path and method from the parsed URL
  const path = reqUrl.pathname;
  const method = req.method;

  // If no path is specified, send a simple success message
  if (path === '/') {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    res.end("Server running successfully.");
    return;
  }

  // Load the JSON data from db.json
  const dbData = loadJsonData(config.dbFilePath);

  // Find the corresponding data based on the request path
  const requestData = findDataByPath(dbData, path);

  if (!requestData) {
    res.statusCode = 404;
    res.end("Not Found");
    return;
  }

  // Route the request based on the HTTP method
  switch (method) {
    case "GET":
      handleGet(req, res, requestData);
      break;
    case "POST":
      // Handle POST request
      break;
    case "DELETE":
      // Handle DELETE request
      break;
    default:
      // If the method is not allowed, send a 405 Method Not Allowed response
      res.statusCode = 405;
      res.end("Method Not Allowed");
  }
};

module.exports = { handleRequest };
