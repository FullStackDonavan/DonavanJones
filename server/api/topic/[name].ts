import { getTopicIdByName, getSeriesByTopicId, getVideosByTopicId } from "~~/server/database/repositories/videoRepository"

export default eventHandler(async (event) => {
  const topicName = event.context.params.name;

  // Fetch the topic by name
  const topic = await getTopicIdByName(topicName);

  // Handle the case where the topic is not found
  if (!topic) {
    throw createError({
      statusCode: 404,
      statusMessage: `Topic '${topicName}' not found`,
    });
  }

  // Fetch series and videos by topic ID
  const series = await getSeriesByTopicId(topic.id);
  const videos = await getVideosByTopicId(topic.id);

  // Reverse videos if topic ID is 2
  if (topic.id === 2) {
    videos.reverse();
  }

  // Return the data
  return { series, videos, topic };
});
