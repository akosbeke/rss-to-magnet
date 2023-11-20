# RSS to Magnet

This is a simple TypeScript project that grabs a `feedURL` and visits each item's link. It then searches for at least one magnet link and appends it to the original RSS feed as an `enclosure` for `application/x-bittorrent`.

## Installation

This project meant to use with docker stack. This of course can be Portainer as well.

Here's the docker compose file you need to run it:

```
---
version: "3"
services:
  app:
    image: akosbeke/rss-to-magnet:1.0.0
    ports:
      - "3000:3000"
    environment:
      - PORT=3000
      - REDIS_URL=redis://redis:6379
      # - DOMAIN=https://example.com
    depends_on:
      - redis
  redis:
    image: redis:latest
```

## Usage

### Feed converter link

```
<YOUR_IP_OR_DOMAIN>:<PORT>/?feedUrl=<ORIGINAL_RSS_FEED_URL>
```

Example: http://localhost:3000/?feedUrl=http://example.com/rss.atom

### Clear cache

```
<YOUR_IP_OR_DOMAIN>:<PORT>/clear-cache
```

Example: http://localhost:3000/clear-cache
