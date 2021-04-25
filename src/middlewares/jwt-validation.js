const { createError } = require('../utils/helper');
const { ERROR_MSG } = require('../configs/error-messages');
const { SECRET_TOKEN } = require('../configs/config');
const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.get('Authorization');
    if (!authHeader) throw createError(401, ERROR_MSG.NOT_AUTHORIZED);

    const [tokenType, token] = authHeader.split(' ');

    if (tokenType !== 'Bearer')
      throw createError(401, ERROR_MSG.NOT_AUTHORIZED);
    if (!token) throw createError(401, ERROR_MSG.NOT_AUTHORIZED);

    const isJWTTokenVerify = jwt.verify(token, SECRET_TOKEN);
    if (!isJWTTokenVerify) throw createError(401, ERROR_MSG.NOT_AUTHORIZED);

    req.userId = +isJWTTokenVerify.userId;

    next()
  } catch (error) {
    next(error);
  }
};
