// requestHandler.js
const url = require("url");
const {
  loadJsonData,
  findDataByPath,
  saveJsonData,
  deleteDataByPath,
  findDataByPathAndQuery,
} = require("./utils");

/**
 * Handles HTTP GET requests by responding with JSON data.
 * @param {http.IncomingMessage} req - The HTTP request object.
 * @param {http.ServerResponse} res - The HTTP response object.
 * @param {Object} data - The JSON data to be sent in the response.
 * @returns {void}
 */
const handleGet = (req, res, dbData, queryParameters) => {
  /**
   * Represents the HTTP status code of the response.
   * @type {number}
   */
  let statusCode;

  /**
   * Represents the content type of the response.
   * @type {string}
   */
  let contentType;

  const reqUrl = url.parse(req.url, true);
  const path = reqUrl.pathname;

  let requestData = findDataByPathAndQuery(dbData, path, queryParameters);

  if (!requestData) {
    statusCode = 404;
    contentType = "text/plain";
    res.statusCode = statusCode;
    res.setHeader("Content-Type", contentType);
    res.end("Not Found");
    return;
  }

  statusCode = 200;
  contentType = "application/json";
  res.statusCode = statusCode;
  res.setHeader("Content-Type", contentType);
  res.end(JSON.stringify(requestData));
};

/**
 * Handles HTTP POST requests by updating JSON data and responding with updated data.
 * @param {http.IncomingMessage} req - The HTTP request object.
 * @param {http.ServerResponse} res - The HTTP response object.
 * @param {Object} data - The JSON data used in the request handling process.
 * @param {Object} config - The server configuration object.
 * @param {string} config.dbFilePath - The file path to the JSON database.
 * @returns {void}
 */
const handlePost = (req, res, data, config) => {
  /**
   * Represents the request body data as a string.
   * @type {string}
   */
  let requestBody = "";

  // Collect request body data
  req.on("data", (chunk) => {
    requestBody += chunk.toString();
  });

  // When request body is fully received
  req.on("end", () => {
    try {
      // Parse the request body as JSON
      const postData = JSON.parse(requestBody);

      // Parse the request URL to extract the path and query parameters
      const reqUrl = url.parse(req.url, true);
      const path = reqUrl.pathname;
      const queryParameters = reqUrl.query;

      // Load the JSON data from db.json
      const dbData = loadJsonData(config.dbFilePath);

      // Find the corresponding data based on the request path and query parameters
      let requestData = findDataByPathAndQuery(dbData, path, queryParameters);

      // If requestData is falsy, meaning the data doesn't exist, add the postData to the database
      if (!requestData && !postData) {
        // If there's no data at the requested path with given query parameters, return 404
        res.statusCode = 404;
        res.end("Data not found.");
        return;
      }

      // Replace the existing data with the new values from the request body
      const finalData = [
        ...(requestData ?? requestData),
        ...(postData ?? postData),
      ];
      // Update the existing data with the new values from the request body

      Object.assign(requestData, finalData);

      // Save the updated data back to the JSON file
      saveJsonData(config.dbFilePath, requestData);

      // Respond with updated data
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(dbData));
    } catch (error) {
      console.log("error_____error___", error);
      // If there's an error parsing the request body or updating the data, send a 400 Bad Request response
      res.statusCode = 400;
      res.end("Bad Request");
    }
  });
};

const handleDelete = (req, res, data, config) => {
  // Parse the request URL to extract the path
  const reqUrl = url.parse(req.url, true);
  const path = reqUrl.pathname;

  // Load the JSON data from db.json
  let dbData = loadJsonData(config.dbFilePath);

  // Find the corresponding data based on the request path
  const requestData = findDataByPath(dbData, path);

  if (!requestData) {
    res.statusCode = 404;
    res.end("Not Found");
    return;
  }

  // Remove the data based on the request path
  deleteDataByPath(dbData, path);

  // Save the updated data back to the JSON file
  saveJsonData(config.dbFilePath, dbData);

  // Respond with a success message
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.end("Data deleted successfully.");
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
  if (path === "/") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    res.end("Server running successfully.");
    return;
  }

  // Extracting query parameters
  const queryParameters = reqUrl.query;
  // Load the JSON data from db.json
  const dbData = loadJsonData(config.dbFilePath);

  let matchedData;

  // Route the request based on the HTTP method
  switch (method) {
    case "GET":
      handleGet(req, res, dbData, queryParameters);
      break;
    case "POST":
      handlePost(req, res, matchedData, config);
      break;
    case "DELETE":
      handleDelete(req, res, matchedData, config), query;
      break;
    default:
      // If the method is not allowed, send a 405 Method Not Allowed response
      res.statusCode = 405;
      res.end("Method Not Allowed");
  }
};

module.exports = { handleRequest };
