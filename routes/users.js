const router = require('express').Router();
const {
  validateUpdateUser,
} = require('../middlewares/validations');

const {
  updateUser, getMyProfile,
} = require('../controllers/users');

router.get('/me', getMyProfile);

router.patch('/me', validateUpdateUser, updateUser);

module.exports = router;
