const jwt = require('jsonwebtoken');

const { NODE_ENV, SECRET_KEY } = process.env;

const generateToken = (payload) => jwt.sign(payload, NODE_ENV === 'production' ? SECRET_KEY : 'dev', { expiresIn: '7d' });

const checkToken = (token) => jwt.verify(token, NODE_ENV === 'production' ? SECRET_KEY : 'dev');

module.exports = { generateToken, checkToken };
