import express, { Express, Request, Response } from "express";
import Parser from "rss-parser";
import { convertFeed } from "./utils/convertFeed";

const app: Express = express();
const port = process.env.PORT || 3000;

const parser = new Parser();

app.get("/", async (req: Request<{ feedUrl: string }>, res: Response) => {
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

  try {
    const inputFeed = await parser.parseURL(feedUrl);
    const feed = await convertFeed(inputFeed);

    res.set("Content-Type", "text/xml");
    res.send(feed.xml());
  } catch (error) {
    res.status(400);
    res.send("Error parsing feed");
    return;
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
