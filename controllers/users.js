const bcrypt = require('bcryptjs');
const { generateToken } = require('../helpers/jwt');
const User = require('../models/user');
const { OkCodeCreated } = require('../costants/constants');
const NotFoundError = require('../errors/not-found-err');
const UnauthorizationError = require('../errors/unauth-err');
const BadDataError = require('../errors/bad-data-err');
const ConflictEmailError = require('../errors/coflict-err');

const MONGO_DUPLICATE_ERROR_CODE = 11000;
const SALT_ROUNDS = 10;

module.exports.getMyProfile = (req, res, next) => {
  const { _id } = req.user;
  User.findById(_id)
    .orFail(() => { throw new NotFoundError('Ошибка. Пользователь не найден'); })
    .then((user) => res.send(user))
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;

  bcrypt
    .hash(password, SALT_ROUNDS)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((user) => res.status(OkCodeCreated).send({
      name: user.name,
      email: user.email,
      _id: user._id,
    }))
    .catch((err) => {
      if (err.code === MONGO_DUPLICATE_ERROR_CODE) {
        next(new ConflictEmailError('Ошибка. Пользователь с таким email уже зарегистрирован'));
        return;
      }
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadDataError('Ошибка. Данные не корректны'));
        return;
      }
      next(err);
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email }, {
    new: true,
    runValidators: true,
  })
    .orFail(() => { throw new NotFoundError('Ошибка. Пользователь не найден'); })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.code === MONGO_DUPLICATE_ERROR_CODE) {
        next(new ConflictEmailError('Ошибка. Пользователь с таким email уже зарегистрирован'));
        return;
      }
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadDataError('Ошибка. Данные не корректны'));
        return;
      }
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => generateToken({ _id: user._id }))
    .then((token) => {
      res.cookie('jwt', token, {
        maxAge: 3600000 * 7 * 24,
        httpOnly: true,
        sameSite: true,
        secure: true,
      })
        .send({ token });
    })
    .catch(() => {
      next(new UnauthorizationError('Ошибка. Неправильные почта или пароль'));
    });
};

module.exports.logout = (req, res) => {
  res.clearCookie('jwt').send({ message: 'Выход' });
};
