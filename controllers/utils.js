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
    const jsonData = fs.readFileSync(filePath, 'utf8');
    if (!jsonData) {
      throw new Error('File is empty');
    }
    return JSON.parse(jsonData);
  } catch (error) {
    console.error('Error loading JSON data:', error);
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

/**
 * Saves JSON data to a file.
 * @param {string} filePath - The path to the JSON file.
 * @param {Object} data - The JSON data to save.
 * @param {Function} [callback] - Optional callback function.
 * @returns {void}
 */
const saveJsonData = (filePath, data, callback) => {
  /**
   * Callback function to handle errors.
   * @callback SaveJsonDataCallback
   * @param {?Error} err - Error object, if any.
   */

  /**
   * Writes JSON data to the file.
   * @param {?Error} err - Error object, if any.
   * @returns {void}
   */
  const writeFileCallback = (err) => {
    if (typeof callback === 'function') {
      callback(err);
    }
  };

  fs.writeFile(filePath, JSON.stringify(data, null, 2), writeFileCallback);
};

/**
 * Deletes data from a nested object based on the provided path.
 * @param {object} data - The nested object from which data will be deleted.
 * @param {string} path - The path specifying the location of the data to be deleted.
 * @returns {void}
 */
const deleteDataByPath = (data, path) => {
  /**
   * Array containing individual parts of the path.
   * @type {string[]}
   */
  const pathParts = path.split('/').filter(part => part !== '');

  /**
   * Current data being traversed in the nested object.
   * @type {object}
   */
  let currentData = data;

  // Traverse through the data structure based on the path
  for (let i = 0; i < pathParts.length - 1; i++) {
      const part = pathParts[i];
      if (currentData.hasOwnProperty(part)) {
          currentData = currentData[part];
      } else {
          // If any part of the path does not exist in the data structure, return
          return;
      }
  }

  /**
   * Key to delete from the nested object.
   * @type {string}
   */
  const keyToDelete = pathParts[pathParts.length - 1];

  // Delete the key from the data structure
  delete currentData[keyToDelete];
};




module.exports = { loadJsonData, findDataByPath, saveJsonData, deleteDataByPath };
