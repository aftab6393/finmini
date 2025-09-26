// backend/middleware/cache.js
const redis = require('redis');
const client = redis.createClient();

const cache = (duration) => {
  return async (req, res, next) => {
    const key = req.originalUrl;
    try {
      const cached = await client.get(key);
      if (cached) {
        return res.json(JSON.parse(cached));
      }
      res.sendResponse = res.json;
      res.json = (data) => {
        client.setex(key, duration, JSON.stringify(data));
        res.sendResponse(data);
      };
      next();
    } catch (err) {
      next();
    }
  };
};
