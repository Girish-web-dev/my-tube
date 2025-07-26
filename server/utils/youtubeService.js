const axios = require("axios");
const logger = require("./logger");

const apiKeys = process.env.YOUTUBE_API_KEYS.split(",");
let currentKeyIndex = 0;

const getNextApiKey = () => {
  const key = apiKeys[currentKeyIndex];
  currentKeyIndex = (currentKeyIndex + 1) % apiKeys.length;
  logger.info(`Using API Key Index: ${currentKeyIndex}`);
  return key;
};

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
    throw error;
  }
};

module.exports = { makeYoutubeRequest };
