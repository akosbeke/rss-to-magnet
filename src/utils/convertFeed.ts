import RSS from "rss";
import { Output } from "rss-parser";
import { getMagnetUrl } from "./getMagnetUrl";
import { redisClient } from "../lib/redis";

// Takes an RSS feed and returns a new RSS feed with magnet links
export const convertFeed: (
  inputFeed: Output<{}>,
  host: string,
  feedUrl: string,
) => Promise<RSS> = async (inputFeed, host, feedUrl) => {
  const feed = new RSS({
    title: inputFeed.title || "",
    site_url: inputFeed.link || "",
    feed_url: `${host}/?feedUrl=${feedUrl}`,
  });

  await Promise.all(
    inputFeed.items?.map(async (item) => {
      if (!item.link) return;

      // Check if magnet link is cached
      let magnetUrl = await redisClient.get(item.link);

      // If not, fetch it and cache it
      if (!magnetUrl) {
        magnetUrl = await getMagnetUrl(item.link);
        redisClient.set(item.link, magnetUrl);
      }

      if (magnetUrl) {
        feed.item({
          title: item.title || "",
          description: item.content || "",
          url: item.link || "",
          date: item.isoDate || "",
          enclosure: {
            url: magnetUrl,
            type: "application/x-bittorrent",
          },
        });
      }
    }),
  );

  return feed;
};
