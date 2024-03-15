/**
 * Utility functions for working with JSON data and paths.
 * @module utils
 */

const fs = require("fs");

/**
 * Loads JSON data from the specified file path.
 * @param {string} filePath - The path to the JSON file.
 * @returns {Object|null} The parsed JSON data, or null if an error occurs.
 */
const loadJsonData = (filePath) => {
  try {
    const jsonData = fs.readFileSync(filePath, "utf8");
    return JSON.parse(jsonData);
  } catch (error) {
    console.error("Error loading JSON data:", error);
    return null;
  }
};

/**
 * Finds data in a JSON object based on the provided path.
 * @param {Object} data - The JSON object to search.
 * @param {string} path - The path to the desired data.
 * @returns {*} The data found at the specified path, or null if not found.
 */
const findDataByPath = (data, path) => {
  const pathParts = path.split("/").filter(part => part !== "");
  let currentData = data;
  for (const part of pathParts) {
    if (!currentData || typeof currentData !== "object") {
      return null;
    }
    currentData = currentData[part];
  }
  return currentData;
};

module.exports = { loadJsonData, findDataByPath };
