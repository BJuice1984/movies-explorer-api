require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const cors = require('cors');
const helmet = require('helmet');
const { limiter } = require('./helpers/limiter');
const routes = require('./routes/index');
const { ErrCodeServer } = require('./costants/constants');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { NODE_ENV, PORT, MONGO_ADRESS } = process.env;

const app = express();
mongoose.connect(NODE_ENV === 'production' ? MONGO_ADRESS : 'mongodb://localhost:27017/moviesdb', {
  useNewUrlParser: true,
});

const allowedCors = [
  'http://api.mesto.bjuice.nomoredomains.xyz',
  'http://mesto.bjuice.nomoredomains.xyz',
  'https://api.mesto.bjuice.nomoredomains.xyz',
  'https://mesto.bjuice.nomoredomains.xyz',
];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Apply the rate limiting middleware to all requests
app.use(limiter);

app.use(helmet());
app.use(cors({
  origin: allowedCors,
  credentials: true,
}));

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(requestLogger);

app.use(routes);

app.use(errorLogger);

app.use(errors());

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
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
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
