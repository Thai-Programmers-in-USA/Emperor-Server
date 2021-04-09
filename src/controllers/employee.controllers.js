// INFO import libraries
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

// INFO import modules + functions
const { createError } = require('../utils/helper');
const Employee = require('../models/employee.model');

exports.createUser = async (req, res, next) => {
  try {
    // INFO validate inputs
    // TODO Move this into middleware
    const errors = validationResult(req);
    if (!errors.isEmpty()) throw createError(422, 'Invalid input(s)', errors);

    const {
      fName,
      lName,
      email,
      password,
      phone,
      authenticationLevel,
    } = req.body;

    // INFO generate hashed password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 12);

    // INFO Insert new user into database
    const createdEmployee = await Employee.create({
      fName,
      lName,
      email,
      password: hashedPassword,
      phone,
      authenticationLevel,
    });
    if (!createdEmployee) throw createError(500, 'Database connection error');

    // INFO Delete password property from createdUser
    delete createdEmployee.password;
    delete createdEmployee.authenticationLevel;

    // INFO return createdUser data to client without password
    res
      .status(201)
      .json({ msg: 'Successfully created an employee', createdEmployee });
  } catch (error) {
    error.statusCode = error.statusCode || 500;
    next(error);
    return error;
  }
};
