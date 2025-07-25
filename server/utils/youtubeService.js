const axios = require("axios");
const logger = require("./logger");

// Load all keys from the .env file and split them into an array
const apiKeys = process.env.YOUTUBE_API_KEYS.split(",");
let currentKeyIndex = 0; // This variable will track which key to use next

// This is the core of the round-robin logic
const getNextApiKey = () => {
  // Select the key at the current index
  const key = apiKeys[currentKeyIndex];

  // Move the index to the next key for the *next* time this function is called
  // The modulo (%) operator makes it wrap around to 0 when it reaches the end
  currentKeyIndex = (currentKeyIndex + 1) % apiKeys.length;

  logger.info(`Using API Key Index: ${currentKeyIndex}`);
  return key;
};

// This function attempts a request, and if it fails due to a quota error,
// it can be expanded to retry with the next key. For now, it just gets the next key.
const makeYoutubeRequest = async (url, params) => {
  const apiKey = getNextApiKey();
  const allParams = { ...params, key: apiKey };

  try {
    const response = await axios.get(url, { params: allParams });
    return response;
  } catch (error) {
    logger.error(
      `YouTube API request failed with key index ${currentKeyIndex}. Error: ${error.message}`
    );
    // In a more advanced setup, you would catch the 403 error here and trigger a retry.
    // For now, we just re-throw the error.
    throw error;
  }
};

module.exports = { makeYoutubeRequest };
