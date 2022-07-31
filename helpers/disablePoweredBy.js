function disablePoweredBy(req, res, next) {
  res.removeHeader('X-Powered-By');

  next();
}

module.exports = { disablePoweredBy };
