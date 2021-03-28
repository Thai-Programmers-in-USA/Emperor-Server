const { validationResult } = require('express-validator');
const { createError } = require('../utils/helper');
const S3Util = require('../utils/S3');
const ProductModel = require('../models/product.model');
const PhotoModel = require('../models/photo.model');
const { rootDir } = require('../utils/helper');

/**
 * @function creating product in the database
 * @param {object} req | Express HTTP request object represents the HTTP request
 * @param {object} req.body
 * @param {string} req.body.name
 * @param {boolean} req.body.isOnSale
 * @param {number} req.body.salePercentage
 * @param {boolean} req.body.isNewArrival
 * @param {string} req.body.description
 * @param {number} req.body.price
 * @param {object} req.body.stock
 * @param {number} req.body.stock.numberOfImages
 * @param {object[]} req.body.stock.list
 * @param {number[]} req.body.category
 * @param {object} res | Express HTTP response object represents the HTTP response
 * @param {function} next | Callback funtion passed by express, call to pass data to the next middleware
 */
exports.createProduct = async (req, res, next) => {
  try {
    // INFO 1. Validate inputs
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty())
      throw createError(422, 'Invalid input(s)', validationErrors);

    // INFO 2. Get file from multer
    const { files } = req;

    let filePaths; // ['url1', 'url2', ...., 'urln']

    // INFO 3. upload files to s3 if there is any
    if (files) {
      filesPaths = await S3Util.uploadFileToS3(files, 'images');
    }

    // INFO 4. fil

    // const {
    //   name,
    //   isOnSale = false,
    //   salePercentage = 0,
    //   isNewArrival = false,
    //   description,
    //   price,
    //   stock,
    //   category = [],
    // } = req.body;

    // // INFO Create product
    // const createdProduct = await ProductModel.create({
    //   name,
    //   isOnSale,
    //   salePercentage,
    //   isNewArrival,
    //   description,
    //   price,
    // });
    // if (!createdProduct) throw createError(500, 'Internal server errors');

    // // INFO Upload photos to s3
    // if (files.length) {
    //   filePaths = await S3Util.uploadFileToS3(files, 'image');
    //   if (!filePaths) throw createError(500, 'Internal server errors');
    // }

    // if (filePaths) {
    //   await Product.addProducts(filePaths);
    // }

    return filePaths;
  } catch (error) {
    next(error);
  }
};
