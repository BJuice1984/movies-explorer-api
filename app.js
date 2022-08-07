require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const { secure } = require('./middlewares/secure');
const { centralizedHandling } = require('./middlewares/centralizedHandling');
const routes = require('./routes/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { NODE_ENV, PORT = 3000, MONGO_ADRESS } = process.env;

const app = express();
mongoose.connect(NODE_ENV === 'production' ? MONGO_ADRESS : 'mongodb://localhost:27017/moviesdb', {
  useNewUrlParser: true,
});

secure(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(requestLogger);

app.use(routes);

app.use(errorLogger);

app.use(errors());

app.use(centralizedHandling);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
