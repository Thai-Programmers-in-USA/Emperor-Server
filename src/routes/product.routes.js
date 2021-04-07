const express = require('express');
const { body } = require('express-validator');
const ProductControllers = require('../controllers/product.controllers');
const { multipleUpload, singleUpload } = require('../middlewares/multer');

module.exports = (app) => {
  const router = express.Router();

  router.post('/api/product', multipleUpload, ProductControllers.createProduct);

  router.get('/api/products', ProductControllers.getProducts);

  app.use(router);
};
