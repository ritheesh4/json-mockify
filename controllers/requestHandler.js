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

const handleRequest = (req, res, config) => {
  const reqUrl = url.parse(req.url, true);
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
      res.statusCode = 405;
      res.end("Method Not Allowed");
  }
};

module.exports = { handleRequest };
