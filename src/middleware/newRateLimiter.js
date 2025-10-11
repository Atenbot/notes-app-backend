const rateLimit = {};

function rateLimiter(windowMs = 15 * 60 * 1000, max = 100) {
  return (req, res, next) => {
    if (process.env.NODE_ENV !== "production") {
      return next();
    }

    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();

    if (!rateLimit[ip]) {
      rateLimit[ip] = { count: 1, resetTime: now + windowMs };
      return next();
    }

    if (now > rateLimit[ip].resetTime) {
      rateLimit[ip] = { count: 1, resetTime: now + windowMs };
      return next();
    }

    if (rateLimit[ip].count >= max) {
      return res.status(429).json({ error: "Too many requests" });
    }

    rateLimit[ip].count++;
    next();
  };
}

module.exports = { rateLimiter };
