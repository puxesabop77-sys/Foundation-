export default async function handler(req, res) {

  const API_KEY = process.env.YOUTUBE_DATA_API_KEY;

  const query = req.query.q || "Class 5 Mathematics";

  try {

    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=30&q=${encodeURIComponent(query)}&key=${API_KEY}`
    );

    const data = await response.json();

    const videos = data.items.map(item => ({
      videoId: item.id.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.high?.url ||
                 item.snippet.thumbnails.medium?.url
    }));

    return res.status(200).json(videos);

  } catch (error) {

    return res.status(500).json({
      error: "Failed to fetch videos"
    });

  }

      }
