/**
 * TOPIC: Create product
 * -------------------------
 * TODO: Test 1
 * SUB TOPIC: Test
 *
 * TODO: Test 2
 * SUB TOPIC: Test validation error object
 * INFO: Server should return code "422" with message "invalid input(s)", and errors array back to client - if validation failed
 *
 * TODO: Test 3
 * SUB TOPIC: Test check photo sent from client
 * INFO: Test if photo(s) sent in the body, server should call s3 to store the photos and wise versa
 *
 * TODO: Test 4
 * SUB TOPIC: Test check category(ies) sent from client
 * INFO: Test if category(ies) sent in the body, server should call product.addCategorys([]) to store them and wise versa
 *
 * TODO: Test 5
 * SUB TOPIC: Test check stock(s) sent from client
 * INFO: Test if stock(s) sent in the body, server should call product.addStocks([]) to store them and wise versa
 *
 * TODO: Test 6
 * SUB TOPIC: Test database connection error or product.create throw error in all possible database connection invole
 * INFO: Server should retrun code "500" with message "Internal server errors" back to client
 *
 * TODO: Test final
 * SUB TOPIC: Test successfully create a product
 * INFO: Server should return code "201" with message "Successfully created a product", and created product object back to client
 */

// INFO import libraries
const httpMock = require('node-mocks-http');

// INFO import modules
const ProductControllers = require('../../../../controllers/product.controllers');

// INFO Mocks
jest.mock('express-validator');
const { validationResult } = require('express-validator');

jest.mock('../../../../utils/S3');
const S3Util = require('../../../../utils/S3');

jest.mock('../../../../models/photo.model');
const PhotoModel = require('../../../../models/photo.model');

jest.mock('../../../../models/category.model');
const CategoryModel = require('../../../../models/category.model');

jest.mock('../../../../models/product.model');
const ProductModel = require('../../../../models/product.model');

jest.mock('../../../../models/stock.model');
const StockModel = require('../../../../models/stock.model');

const validationErrorsObj = require('../../__mocks__/data/validationResult.json');

const productsMock = require('../../__mocks__/data/product.json');

const req = httpMock.createRequest();
let res = httpMock.createResponse();

const includeOption = [
  { model: PhotoModel, as: 'photos' },
  { model: StockModel, as: 'stocks' },
  CategoryModel,
];

describe('Test Product Controller - create - test validator', () => {
  beforeEach(() => {
    res = httpMock.createResponse();
    // INFO Mock validationResult return { isEmpty: () => true}
    validationResult.mockReturnValue({
      isEmpty: () => true,
      errors: [],
    });
  });
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be a function', () => {
    expect.assertions(1);
    expect(typeof ProductControllers.createProduct).toBe('function');
  });

  it('should call validationResult once', async () => {
    await ProductControllers.createProduct(req, res, () => {});
    expect.assertions(1);
    expect(validationResult).toHaveBeenCalledTimes(1);
  });

  it('should return code "422" with message "Invalid input(s)", and errors array back to client - if validation failed ', async () => {
    validationResult.mockReset();

    // INFO Mock validationResult return { isEmpty: () => false, errors: [{},{}] }
    validationResult.mockReturnValue({
      isEmpty: () => false,
      ...validationErrorsObj,
    });

    // INFO Call function
    let err;
    await ProductControllers.createProduct(req, res, (error) => {
      err = error;
    });

    // INFO Testing
    expect.assertions(5);
    expect(err).toHaveProperty('statusCode', 422);
    expect(err).toHaveProperty('message', 'Invalid input(s)');
    expect(err).toHaveProperty('errors');
    expect(err.errors).toBeInstanceOf(Array);
    expect(err.errors).toHaveLength(2);

    // INFO reset mocked validationResult
    validationResult.mockReset();
  });
});

describe('Test Product Controller - create - calling S3Util.uploadPhotoToS3', () => {
  beforeEach(() => {
    res = httpMock.createResponse();
    // INFO Mock validationResult return { isEmpty: () => true}
    validationResult.mockReturnValue({
      isEmpty: () => true,
      errors: [],
    });

    S3Util.uploadFileToS3.mockReturnValue([]);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should not call uploadPhotoToS3() - if there is no photo', async () => {
    // req.files is array of `photos` files
    req.files = undefined;

    // INFO Call function
    await ProductControllers.createProduct(req, res, () => {});

    expect.assertions(1);
    expect(S3Util.uploadFileToS3).toHaveBeenCalledTimes(0);
  });

  it('should call s3 uploadPhotoToS3() once - if there is at least one photo', async () => {
    req.files = [{}];
    // INFO Mock uploadPhotoToS3()
    // ** this also working
    // const spy = jest.spyOn(S3, 'uploadFileToS3');
    // spy.mockResolvedValue([])

    await ProductControllers.createProduct(req, res, () => {});
    expect.assertions(2);
    expect(S3Util.uploadFileToS3).toHaveBeenCalledTimes(1);
    expect(S3Util.uploadFileToS3).toHaveBeenCalledWith(req.files, 'images');
  });

  it('should call s3 uploadPhotoToS3() only once - if there is more than one photo', async () => {
    req.files = [{}, {}, {}, {}];

    await ProductControllers.createProduct(req, res, () => {});
    expect.assertions(2);
    expect(S3Util.uploadFileToS3).toHaveBeenCalledTimes(1);
    expect(S3Util.uploadFileToS3).toHaveBeenCalledWith(req.files, 'images');
  });
});

describe('Test Product Controller - create - creating product with "Photo" association', () => {
  beforeAll(() => {
    req.body = productsMock['request']['withPhoto'];
  });
  beforeEach(() => {
    res = httpMock.createResponse();
    // INFO Mock validationResult return { isEmpty: () => true}
    validationResult.mockReturnValue({
      isEmpty: () => true,
      errors: [],
    });

    // INFO Mock upload photo to s3 to return ['photo1', 'photo2']
    S3Util.uploadFileToS3.mockReturnValue(['photo1', 'photo2']);
  });
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should call next function with error, if Product.create() failed', async () => {
    ProductModel.create.mockReturnValue(undefined);

    let error;
    await ProductControllers.createProduct(req, res, (err) => {
      error = err;
    });

    expect.assertions(3);
    expect(error).toBeInstanceOf(Error);
    expect(error).toHaveProperty('statusCode', 500);
    expect(error).toHaveProperty('message', 'Internal server errors');
  });

  it('should call Product.create() with the array of photo objects', async () => {
    // INFO set req.body
    // req.body = productsMock['request']['withPhoto'];
    const input = req.body;
    delete input.categories;

    // INFO Mock ProductModel.create()
    ProductModel.create = jest.fn();

    await ProductControllers.createProduct(req, res, () => {});

    expect.assertions(3);

    expect(ProductModel.create).toHaveBeenCalled();
    expect(ProductModel.create).toHaveBeenCalledTimes(1);
    expect(ProductModel.create).toHaveBeenCalledWith(
      {
        ...input,
        photos: [
          { path: 'photo1', position: 0 },
          { path: 'photo2', position: 1 },
        ],
      },
      { include: includeOption }
    );
  });

  it('should return product with photos field to the client', async () => {
    const input = req.body;
    delete input.categories;

    ProductModel.create.mockReturnValue(productsMock['response']['withPhoto']);

    await ProductControllers.createProduct(req, res, () => {});

    expect.assertions(8);
    expect(res).toHaveProperty('statusCode', 201);
    const data = res._getJSONData();
    expect(data.msg).toBe('Successfully created product');
    expect(data.createdProduct).toHaveProperty('photos');
    expect(data.createdProduct.photos).toHaveLength(2);
    expect(data.createdProduct.photos[0]).toHaveProperty(
      'path',
      'product_photo_1'
    );
    expect(data.createdProduct.photos[0]).toHaveProperty('position', 0);
    expect(data.createdProduct.photos[1]).toHaveProperty(
      'path',
      'product_photo_2'
    );
    expect(data.createdProduct.photos[1]).toHaveProperty('position', 1);
  });
});

describe('Test Product Controller - create - creating product with "Stock" association', () => {
  beforeAll(() => {
    req.body = productsMock['request']['withPhotoStock'];
  });
  beforeEach(() => {
    res = httpMock.createResponse();
    validationResult.mockReturnValue({ isEmpty: () => true, errors: [] });
    S3Util.uploadFileToS3.mockReturnValue([
      'product_photo_1',
      'product_photo_2',
      'stock_photo_1',
      'stock_photo_2',
      'stock_photo_3',
    ]);
  });
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it('should call Product.create with correct product photos and stock photos', async () => {
    const input = req.body;
    delete input.categories;
    input.photos = productsMock['response']['withPhotoStock']['photos'];
    input.stocks = productsMock['response']['withPhotoStock']['stocks'];

    const createProductSyp = jest.spyOn(ProductModel, 'create');
    createProductSyp.mockResolvedValue(
      productsMock['response']['withPhotoStock']
    );

    await ProductControllers.createProduct(req, res, () => {});

    expect.assertions(2);
    expect(createProductSyp).toHaveBeenCalledTimes(1);
    expect(createProductSyp).toHaveBeenCalledWith(
      { ...input },
      { include: includeOption }
    );
  });

  it('should return the created product with stock field in it', async () => {
    const input = req.body;
    delete input.categories;
    input.photos = productsMock['response']['withPhotoStock']['photos'];
    input.stocks = productsMock['response']['withPhotoStock']['stocks'];

    const createProductSyp = jest.spyOn(ProductModel, 'create');
    createProductSyp.mockResolvedValue(
      productsMock['response']['withPhotoStock']
    );

    await ProductControllers.createProduct(req, res, () => {});

    expect.assertions(17);
    expect(res).toHaveProperty('statusCode', 201);
    const data = res._getJSONData();
    expect(data).toHaveProperty('createdProduct');
    expect(data.createdProduct).toHaveProperty('stocks');
    expect(data.createdProduct.stocks).toBeInstanceOf(Array);
    expect(data.createdProduct.stocks).toHaveLength(3);
    expect(data.createdProduct.stocks[0]).toHaveProperty('name', 'stock1');
    expect(data.createdProduct.stocks[0]).toHaveProperty('price', 400);
    expect(data.createdProduct.stocks[0]).toHaveProperty('quantity', 100);
    expect(data.createdProduct.stocks[0]).toHaveProperty(
      'photo',
      'stock_photo_1'
    );
    expect(data.createdProduct.stocks[1]).toHaveProperty('name', 'stock2');
    expect(data.createdProduct.stocks[1]).toHaveProperty('price', 400);
    expect(data.createdProduct.stocks[1]).toHaveProperty('quantity', 200);
    expect(data.createdProduct.stocks[1]).toHaveProperty(
      'photo',
      'stock_photo_2'
    );
    expect(data.createdProduct.stocks[2]).toHaveProperty('name', 'stock3');
    expect(data.createdProduct.stocks[2]).toHaveProperty('price', 500);
    expect(data.createdProduct.stocks[2]).toHaveProperty('quantity', 50);
    expect(data.createdProduct.stocks[2]).toHaveProperty(
      'photo',
      'stock_photo_3'
    );
  });
});

describe('Test Product Controller - create - creating product with "Category" association', () => {});
