const router = require('express').Router();
const { body } = require('express-validator');
const EmployeeControllers = require('../controllers/employee.controllers');

module.exports = function (app) {
  router.post(
    '/employee',
    [
      body('fName', 'Invalid First name')
        .trim()
        .notEmpty()
        .toLowerCase()
        .isLength({ min: 3, max: 30 }),
      body('lName', 'Invalid Last name')
        .trim()
        .notEmpty()
        .toLowerCase()
        .isLength({ min: 3, max: 30 }),
      body('email', 'Invalid Email address')
        .trim()
        .notEmpty()
        .toLowerCase()
        .isEmail()
        .isLength(),
      body('password', 'Invalid password')
        .notEmpty()
        .isLength({ min: 8, max: 100 })
        .withMessage('Invalid password length')
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, 'i')
        .withMessage('Invalid password pattern'),
      body('authorizationLevel', 'Invalid authorization level')
        .notEmpty()
        .toLowerCase()
        .isIn(['admin', 'editor', 'employee']),
    ],
    EmployeeControllers.createUser
  );

  app.use('/api', router);
};
