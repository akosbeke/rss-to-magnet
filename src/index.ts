import express, { Express, Request, Response } from "express";
import Parser from "rss-parser";
import { convertFeed } from "./utils/convertFeed";
import { redisClient } from "./lib/redis";

const app: Express = express();
const port = process.env.PORT || 3000;

redisClient.connect();

const parser = new Parser();

// Main proxy endpoint
app.get("/", async (req: Request<{ feedUrl: string }>, res: Response) => {
  const host = process.env.DOMAIN || `${req.protocol}://${req.get("host")}`;

  // get param "feedUrl" from request
  const feedUrl = req.query.feedUrl;

  // check param
  if (!feedUrl || typeof feedUrl !== "string") {
    res.status(400);
    res.send("No feedUrl param");
    return;
  }

  // validatae url
  if (!feedUrl.match(/^(http|https):\/\/.*$/)) {
    res.status(400);
    res.send("Invalid feedUrl param");
    return;
  }

  // Extract magnet links from feed and return new feed
  try {
    const inputFeed = await parser.parseURL(feedUrl);
    const feed = await convertFeed(inputFeed, host, feedUrl);

    res.set("Content-Type", "text/xml");
    res.send(feed.xml());
  } catch (error) {
    res.status(400);
    res.send("Error parsing feed");
    return;
  }
});

// Clear cache endpoint
app.get("/clear-cache", async (_req: Request, res: Response) => {
  await redisClient.flushAll();
  res.send("Cache cleared");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
