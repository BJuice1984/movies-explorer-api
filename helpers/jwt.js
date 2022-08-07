const jwt = require('jsonwebtoken');
const { SECRET_KEY_DEV } = require('./config');

const { NODE_ENV, SECRET_KEY } = process.env;

const generateToken = (payload) => jwt.sign(payload, NODE_ENV === 'production' ? SECRET_KEY : SECRET_KEY_DEV, { expiresIn: '7d' });

const checkToken = (token) => jwt.verify(token, NODE_ENV === 'production' ? SECRET_KEY : SECRET_KEY_DEV);

module.exports = { generateToken, checkToken };
