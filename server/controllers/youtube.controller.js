const { makeYoutubeRequest } = require("../utils/youtubeService");
const logger = require("../utils/logger");

const YOUTUBE_SEARCH_URL = "https://www.googleapis.com/youtube/v3/search";
const YOUTUBE_VIDEOS_URL = "https://www.googleapis.com/youtube/v3/videos";

// A helper function to avoid repeating code, as both controllers now do the same thing.
const fetchAndFormatVideos = async (searchParams) => {
  const searchResponse = await makeYoutubeRequest(
    YOUTUBE_SEARCH_URL,
    searchParams
  );

  const videoIds = searchResponse.data.items
    .map((item) => item.id.videoId)
    .join(",");
  if (!videoIds) {
    return { items: [], nextPageToken: null };
  }

  const detailsResponse = await makeYoutubeRequest(YOUTUBE_VIDEOS_URL, {
    part: "snippet,contentDetails,statistics",
    id: videoIds,
  });

  return {
    items: detailsResponse.data.items,
    nextPageToken: searchResponse.data.nextPageToken,
  };
};

exports.getPopularVideos = async (req, res) => {
  const user = req.user;
  const { pageToken } = req.query; 
  try {
    let videoData;
    if (user && user.feedPreferences && user.feedPreferences.length > 0) {
      const searchQuery = user.feedPreferences.join(" | ");
      logger.info(`Fetching personalized feed for user ${user.id}`);
      videoData = await fetchAndFormatVideos({
        part: "snippet",
        q: searchQuery,
        type: "video",
        maxResults: 24,
        pageToken,
      });
    } else {
      logger.info("Fetching default popular feed.");
      const response = await makeYoutubeRequest(YOUTUBE_VIDEOS_URL, {
        part: "snippet,contentDetails,statistics",
        chart: "mostPopular",
        regionCode: "US",
        maxResults: 24,
        pageToken,
      });
      videoData = {
        items: response.data.items,
        nextPageToken: response.data.nextPageToken,
      };
    }
    return res.status(200).json({ success: true, data: videoData });
  } catch (error) {
    const status = error.response ? error.response.status : 500;
    const message = error.response?.data?.error?.message || "Server Error";
    logger.error(`getPopularVideos failed: ${message}`);
    return res
      .status(status)
      .json({
        success: false,
        message: "Failed to fetch videos from YouTube.",
      });
  }
};

exports.searchVideos = async (req, res) => {
  const { q, pageToken } = req.query;
  if (!q)
    return res
      .status(400)
      .json({ success: false, message: "Please provide a search query." });
  try {
    const videoData = await fetchAndFormatVideos({
      part: "snippet",
      q,
      type: "video",
      maxResults: 24,
      pageToken,
    });
    res.status(200).json({ success: true, data: videoData });
  } catch (error) {
    const status = error.response ? error.response.status : 500;
    const message = error.response?.data?.error?.message || "Server Error";
    logger.error(`searchVideos failed: ${message}`);
    res
      .status(status)
      .json({ success: false, message: "Failed to search YouTube videos." });
  }
};
