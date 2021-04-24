const express = require('express');
const { body } = require('express-validator');
const AuthControllers = require('../controllers/auth.controllers');

module.exports = function (app) {
  const router = express.Router();

  router.post(
    '/signin',
    [
      body('email').trim().isEmail().withMessage('Plase enter a valid email'),
      body('password').isLength({ min: 6 }).withMessage('Invalid password'),
    ],
    AuthControllers.signin
  );

  app.use('/api', router);
};
