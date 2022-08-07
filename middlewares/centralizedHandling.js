const { ErrCodeServer } = require('../costants/constants');

module.exports.centralizedHandling = ((err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = ErrCodeServer, message } = err;

  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === ErrCodeServer
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});
