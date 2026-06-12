export default async function handler(req, res) {

  const API_KEY = process.env.YOUTUBE_DATA_API_KEY;

  const query =
    req.query.q || "Class 5 Class 6 Class 7 Class 8";

  try {

    // Search Videos
    const searchResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=30&q=${encodeURIComponent(query)}&key=${API_KEY}`
    );

    const searchData = await searchResponse.json();

    if (!searchData.items) {
      return res.status(500).json(searchData);
    }

    const videoIds = searchData.items
      .map(item => item.id.videoId)
      .join(",");

    // Get Duration
    const detailsResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoIds}&key=${API_KEY}`
    );

    const detailsData = await detailsResponse.json();

    const durationMap = {};

    detailsData.items.forEach(video => {
      durationMap[video.id] =
        video.contentDetails.duration;
    });

    const videos = searchData.items.map(item => {

      const duration =
        durationMap[item.id.videoId] || "";

      // Shorts <= 60 seconds
      const isShort =
        /^PT([0-5]?\d)S$/.test(duration);

      return {

        videoId: item.id.videoId,

        title: item.snippet.title,

        thumbnail:
          item.snippet.thumbnails.high?.url ||
          item.snippet.thumbnails.medium?.url,

        isShort

      };

    });

    return res.status(200).json(videos);

  } catch (error) {

    return res.status(500).json({
      error: error.message
    });

  }

}
