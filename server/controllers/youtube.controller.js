const { makeYoutubeRequest } = require("../utils/youtubeService");
const logger = require("../utils/logger");

const YOUTUBE_SEARCH_URL = "https://www.googleapis.com/youtube/v3/search";
const YOUTUBE_VIDEOS_URL = "https://www.googleapis.com/youtube/v3/videos";

exports.getPopularVideos = async (req, res) => {
  const user = req.user;
  try {
    let response;
    // --- SIMPLIFIED LOGIC ---
    // If the user has preferences, we search. Otherwise, we get the popular chart.
    if (user && user.feedPreferences && user.feedPreferences.length > 0) {
      const searchQuery = user.feedPreferences.join(" | "); // YouTube syntax for OR
      logger.info(
        `Fetching personalized feed for user ${user.id} with query: "${searchQuery}"`
      );

      const searchResponse = await makeYoutubeRequest(YOUTUBE_SEARCH_URL, {
        part: "snippet",
        q: searchQuery,
        type: "video",
        maxResults: 24,
      });

      const videoIds = searchResponse.data.items
        .map((item) => item.id.videoId)
        .join(",");
      if (!videoIds) return res.status(200).json({ success: true, data: [] }); // Return empty array if no results

      response = await makeYoutubeRequest(YOUTUBE_VIDEOS_URL, {
        part: "snippet,contentDetails,statistics",
        id: videoIds,
      });
      // We send the items directly
      return res.status(200).json({ success: true, data: response.data.items });
    } else {
      logger.info("Fetching default popular feed.");
      response = await makeYoutubeRequest(YOUTUBE_VIDEOS_URL, {
        part: "snippet,contentDetails,statistics",
        chart: "mostPopular",
        regionCode: "US",
        maxResults: 24,
      });
      // We send the items directly and the nextPageToken
      return res.status(200).json({
        success: true,
        data: {
          items: response.data.items,
          nextPageToken: response.data.nextPageToken,
        },
      });
    }
  } catch (error) {
    const status = error.response ? error.response.status : 500;
    const message = error.response
      ? error.response.data.error.message
      : "Server Error";
    logger.error(`getPopularVideos failed with status ${status}: ${message}`);
    return res
      .status(status)
      .json({
        success: false,
        message: "Failed to fetch videos from YouTube.",
      });
  }
};

// The search function is fine, but we'll use a clean version to be sure.
exports.searchVideos = async (req, res) => {
  const searchQuery = req.query.q;
  if (!searchQuery)
    return res
      .status(400)
      .json({ success: false, message: "Please provide a search query." });
  try {
    const searchResponse = await makeYoutubeRequest(YOUTUBE_SEARCH_URL, {
      part: "snippet",
      q: searchQuery,
      type: "video",
      maxResults: 24,
    });
    const videoIds = searchResponse.data.items
      .map((item) => item.id.videoId)
      .join(",");
    if (!videoIds)
      return res
        .status(200)
        .json({ success: true, data: { items: [], nextPageToken: null } });
    const detailsResponse = await makeYoutubeRequest(YOUTUBE_VIDEOS_URL, {
      part: "snippet,contentDetails,statistics",
      id: videoIds,
    });
    res.status(200).json({
      success: true,
      data: {
        items: detailsResponse.data.items,
        nextPageToken: searchResponse.data.nextPageToken,
      },
    });
  } catch (error) {
    const status = error.response ? error.response.status : 500;
    const message = error.response
      ? error.response.data.error.message
      : "Server Error";
    logger.error(`searchVideos failed with status ${status}: ${message}`);
    res
      .status(status)
      .json({ success: false, message: "Failed to search YouTube videos." });
  }
};
