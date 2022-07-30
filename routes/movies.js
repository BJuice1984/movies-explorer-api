const router = require('express').Router();
const {
  validateCreateMovie, validateDeleteMovie,
} = require('../middlewares/validations');

const {
  getMyMovies, createMovie, deleteMovie,
} = require('../controllers/movies');

router.get('/', getMyMovies);
router.post('/', validateCreateMovie, createMovie);
router.delete('/_id', validateDeleteMovie, deleteMovie);

module.exports = router;
