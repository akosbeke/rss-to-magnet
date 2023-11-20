import RSS from "rss";
import { Output } from "rss-parser";
import { getMagnetUrl } from "./getMagnetUrl";

// Takes an RSS feed and returns a new RSS feed with magnet links
export const convertFeed: (inputFeed: Output<{}>) => Promise<RSS> = async (
  inputFeed,
) => {
  const feed = new RSS({
    title: inputFeed.title || "",
    site_url: inputFeed.link || "",
    feed_url: "",
  });

  await Promise.all(
    inputFeed.items?.map(async (item) => {
      const magnetUrl = await getMagnetUrl(item.link);

      item.enclosure = {
        url: magnetUrl,
        type: "application/x-bittorrent",
      };
    }),
  );

  inputFeed.items?.forEach((item) => {
    feed.item({
      title: item.title || "",
      description: item.content || "",
      url: item.link || "",
      date: item.isoDate || "",
      enclosure: item.enclosure,
    });
  });

  return feed;
};
