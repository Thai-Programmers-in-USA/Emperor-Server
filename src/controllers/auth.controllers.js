const { validationResult } = require('express-validator');
const { createError } = require('../utils/helper');
const bcrypt = require('bcrypt');
const Employee = require('../models/employee.model');
const { SECRET_TOKEN, TOKEN_ACTIVE_DURATION } = require('../configs/config');
const jwt = require('jsonwebtoken');

const signin = async (req, res, next) => {
  try {
    // INFO 1. Check validation error
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty())
      throw createError(422, 'Invalid input(s)', validationErrors);

    const { email, password } = req.body;

    // INFO 2. Check user existed
    const [user] = await Employee.findAll({ where: { email: email } });
    if (!user) throw createError(401, 'Invalid credentails');

    // INFO 3. Check password match
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) throw createError(401, 'Invalid credentails');

    // INFO 4. Generate token
    const token = await jwt.sign(
      { email: user.email, userId: user.id.toString() },
      SECRET_TOKEN,
      { expiresIn: TOKEN_ACTIVE_DURATION }
    );

    res
      .status(200)
      .json({ msg: 'Successfully logged in', userId: user.id, token });
  } catch (error) {
    next(error);
    return error;
  }
};

module.exports = {
  signin,
};
