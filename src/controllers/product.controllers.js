const { validationResult } = require('express-validator');
const { createError } = require('../utils/helper');
const S3Util = require('../utils/S3');
const ProductModel = require('../models/product.model');
const PhotoModel = require('../models/photo.model');
const CategoryModel = require('../models/category.model');
const StockModel = require('../models/stock.model');
const { rootDir } = require('../utils/helper');
const { create } = require('../models/product.model');

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
 * @param {number[]} req.body.stocks
 * @param {number[]} req.body.categories
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
      filePaths = await S3Util.uploadFileToS3(files, 'images');
    }

    // INFO 4. structure the photos array to match photo table columns
    const photos = filePaths.map((path, position) => ({
      path,
      position,
    }));

    // INFO 4. create product insert in database

    const {
      name,
      isOnSale = false,
      salePercentage = 0,
      isNewArrival = false,
      description,
      price,
      stocks = [],
      categories = [],
    } = req.body;

    const stockPhotostartPosition = photos.length - stocks.length;

    // INFO 5. Create product
    const createdProduct = await ProductModel.create(
      {
        name,
        isOnSale,
        salePercentage,
        isNewArrival,
        description,
        price,
        photos: stocks.length ? photos.slice(0, stockPhotostartPosition) : photos,
        stocks: stocks.map((stock, index) => ({
          ...stock,
          photo: photos[stockPhotostartPosition + index].path,
        })),
      },
      {
        include: [
          { model: PhotoModel, as: 'photos' },
          { model: StockModel, as: 'stocks' },
          CategoryModel,
        ],
      }
    );
    if (!createdProduct) throw createError(500, 'Internal server errors');

    // INFO 6. Check if there is any photos, insert them into database
    // let resultOfAddPhotos;
    // if (filePaths) {
    //   resultOfAddPhotos = createdProduct.addPhotos(filesPaths);
    // }
    // console.log(resultOfAddPhotos);

    // INFO 6. Check if there is any category, insert them into database

    // INFO 7. Check if there is any stock, insert them into database

    // INFO 8. return createdProduct with photos, cat, and stock back to client

    res
      .status(201)
      .json({ msg: 'Successfully created product', createdProduct });
  } catch (error) {
    next(error);
  }
};

exports.getProducts = async (req, res, next) => {
  try {
    const products = await ProductModel.findAll({
      include: [StockModel, PhotoModel, CategoryModel],
    });
    if (!products) throw new Error();

    res.status(200).json({ products });
  } catch (error) {
    next(error);
  }
};
