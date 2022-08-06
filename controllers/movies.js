const Movie = require('../models/movie');
const { OkCodeCreated } = require('../costants/constants');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');
const BadDataError = require('../errors/bad-data-err');

module.exports.getMyMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.send(movies))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  const owner = req.user._id;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    owner,
    movieId,
    nameRU,
    nameEN,
  })
    .then((movie) => res.status(OkCodeCreated).send({
      country: movie.country,
      director: movie.director,
      duration: movie.duration,
      year: movie.year,
      description: movie.description,
      image: movie.image,
      trailerLink: movie.trailerLink,
      thumbnail: movie.thumbnail,
      owner: movie.owner,
      movieId: movie.movieId,
      nameRU: movie.nameRU,
      nameEN: movie.nameEN,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadDataError('Ошибка. Данные не корректны'));
        return;
      }
      next(err);
    });
};

module.exports.deleteMovie = (req, res, next) => {
  console.log(req.params._id);
  Movie.findById(req.params._id)
    .orFail(() => { throw new NotFoundError('Ошибка. Фильм не найден'); })
    .then((movie) => {
      if (!movie.owner.equals(req.user._id)) {
        return next(new ForbiddenError('Ошибка. Нельзя удалить чужой фильм'));
      }
      return movie.remove()
        .then(() => res.send({ message: 'Фильм удален из избранного' }));
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadDataError('Ошибка. Данные не корректны'));
        return;
      }
      next(err);
    });
};
