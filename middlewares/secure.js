const cors = require('cors');
const helmet = require('helmet');
const rateLimiter = require('express-rate-limit');
const slowDown = require('express-slow-down');
const { disablePoweredBy } = require('../helpers/disablePoweredBy');

const allowedCors = [
  'http://localhost:3000',
  'http://api.diploma.bjuice.nomoredomains.sbs',
  'https://api.diploma.bjuice.nomoredomains.sbs',
];

const limiter = rateLimiter({
  windowsMs: 1 * 60 * 1000,
  max: 120,
});

const speedLimiter = slowDown({
  windowsMs: 1 * 60 * 1000,
  delayAfter: 100,
  delayMs: 1000,
});

function secure(app) {
  app.use(disablePoweredBy);

  app.use(cors({
    origin: allowedCors,
    credentials: true,
  }));

  app.use(helmet({
    contentSecurityPolicy: {
      useDefaults: true,
    },
  }));

  app.use(speedLimiter);
  app.use(limiter);
}

module.exports = { secure };
