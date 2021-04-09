const express = require('express');
const CategoryControllers = require('../controllers/category.controllers');

module.exports = (app) => {
  const router = express.Router();

  router.post('/category', CategoryControllers.createCategory);

  app.use('/api', router);
};
