const express = require('express');
const CategoryControllers = require('../controllers/category.controllers');
const Validators = require('./validations');

module.exports = (app) => {
  const router = express.Router();

  router.post(
    '/category',
    Validators.categoryCreateValdator(),
    CategoryControllers.createCategory
  );

  app.use('/api', router);
};
