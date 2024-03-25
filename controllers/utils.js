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
    if (!jsonData) {
      throw new Error("File is empty");
    }
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
  const pathParts = path.split("/").filter((part) => part !== "");
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
    if (typeof callback === "function") {
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
  const pathParts = path.split("/").filter((part) => part !== "");

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

/**
 * Finds data by path and query parameters in JSON data.
 * @param {Object} data - The JSON data to search within.
 * @param {string} path - The path to locate the data.
 * @param {Object} queryParameters - The query parameters to filter the data.
 * @returns {Object|null} - The found data or null if not found.
 */
const findDataByPathAndQuery = (data, path, queryParameters) => {
  /**
   * Represents the found data based on the path.
   * @type {Object|null}
   */
  let requestData = findDataByPath(data, path);

  // If requestData is falsy, meaning the data doesn't exist, return null
  if (!requestData) {
    return null;
  }

  // Filter data based on query parameters
  const keys = Object.keys(queryParameters);
  if (keys?.length > 0) {
    requestData = requestData?.filter((item) => {
      for (const key of keys) {
        if (item[key] == queryParameters[key]) {
          return true;
        }
      }
      return false;
    });
    return requestData;
  }
  return requestData;
};

/**
 * Replaces or appends an object in an array within a JSON structure based on the query parameters.
 * If no query parameters are provided, appends the new object to the main JSON structure.
 * @param {Object} jsonObject - The JSON object containing the nested arrays.
 * @param {Array<string>} arrayKeys - The array representing the path to the nested array within the JSON structure.
 * @param {Object} queryParams - The query parameters used for matching.
 * @param {Object} newObject - The new object to replace or append.
 * @returns {Object} The updated JSON object after the replacement or addition.
 */
const replaceObjectInNestedArray = (
  jsonObject,
  arrayKeys,
  queryParams,
  newObject
) => {
  // Helper function to traverse the JSON object recursively and find the target array
  const findTargetArray = (obj, keys) => {
    if (keys.length === 0) {
      return obj;
    }
    const currentKey = keys[0];
    const remainingKeys = keys.slice(1);
    if (!obj || typeof obj !== "object" || !obj.hasOwnProperty(currentKey)) {
      return null;
    }
    return findTargetArray(obj[currentKey], remainingKeys);
  };

  // If no query parameters are provided, append the new object to the main JSON structure
  if (Object.keys(queryParams).length === 0) {
    let currentObj = jsonObject;
    // Traverse the arrayKeys except the last one to find the parent object
    for (let i = 0; i < arrayKeys.length - 1; i++) {
      const currentKey = arrayKeys[i];
      if (!currentObj[currentKey]) {
        currentObj[currentKey] = {}; // Create an object if it doesn't exist
      }
      currentObj = currentObj[currentKey];
    }
    // Check if the last key is an array or object and append newObject accordingly
    if (Array.isArray(currentObj[arrayKeys[arrayKeys.length - 1]])) {
      currentObj[arrayKeys[arrayKeys.length - 1]].push(newObject);
    } else {
      currentObj[arrayKeys[arrayKeys.length - 1]] = newObject;
    }
    return jsonObject; // Return the updated JSON object
  }

  // Find the target array using arrayKeys
  const targetArray = findTargetArray(jsonObject, arrayKeys);
  if (!targetArray || !Array.isArray(targetArray)) {
    return jsonObject; // Return the original object if the target array is not found or is not an array
  }

  // Find the index of the object to replace based on queryParams
  const index = targetArray.findIndex((item) => {
    for (let key in queryParams) {
      if (item[key] !== queryParams[key]) {
        return false;
      }
    }
    return true;
  });

  if (index === -1) {
    // If the object matching query parameters does not exist, append the new object to the array
    targetArray.push(newObject);
  } else {
    // Replace the old object with the new one
    targetArray[index] = newObject;
  }

  return jsonObject; // Return the updated JSON object
};

/**
 * Deletes an object from an array within a JSON structure based on the query parameters.
 * @param {Object} jsonObject - The JSON object containing the nested arrays.
 * @param {Array<string>} arrayKeys - The array representing the path to the nested array within the JSON structure.
 * @param {Object} queryParams - The query parameters used for matching.
 * @returns {Object} The updated JSON object after the deletion.
 */
const deleteObjectInNestedArray = (jsonObject, arrayKeys, queryParams) => {
  // Helper function to traverse the JSON object recursively and find the target array
  const findTargetArray = (obj, keys) => {
    if (keys.length === 0) {
      return obj;
    }
    const currentKey = keys[0];
    const remainingKeys = keys.slice(1);
    if (!obj || typeof obj !== "object" || !obj.hasOwnProperty(currentKey)) {
      return null;
    }
    return findTargetArray(obj[currentKey], remainingKeys);
  };

  // Find the target array using arrayKeys
  const targetArray = findTargetArray(jsonObject, arrayKeys);
  if (!targetArray || !Array.isArray(targetArray)) {
    return jsonObject; // Return the original object if the target array is not found or is not an array
  }

  // Find the index of the object to delete based on queryParams
  const index = targetArray.findIndex((item) => {
    for (let key in queryParams) {
      if (item[key] != queryParams[key]) {
        return false;
      }
    }
    return true;
  });

  if (index !== -1) {
    // If the object matching query parameters exists, remove it from the array
    targetArray.splice(index, 1);
  }

  return jsonObject; // Return the updated JSON object
};

/**
 * Splits a path string by "/" and filters out empty parts.
 * @param {string} path - The path string to split.
 * @returns {Array<string>} An array containing non-empty parts of the path.
 */
const arrayOfPaths = (path) => path.split("/").filter((part) => part !== "");

module.exports = {
  loadJsonData,
  findDataByPath,
  saveJsonData,
  deleteDataByPath,
  findDataByPathAndQuery,
  replaceObjectInNestedArray,
  arrayOfPaths,
  deleteObjectInNestedArray,
};
