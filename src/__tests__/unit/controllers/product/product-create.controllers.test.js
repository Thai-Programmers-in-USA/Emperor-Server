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

const validationErrorsObj = require('../../__mocks__/data/validationResult.json');

const req = httpMock.createRequest();
const res = httpMock.createResponse();

req.body;

describe('Test Product Controller - create - test validator', () => {
  beforeEach(() => {
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
    req.files = [];

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
    expect(S3Util.uploadFileToS3).toHaveBeenCalledWith(req.files, 'image');
  });

  it('should call s3 uploadPhotoToS3() only once - if there is more than one photo', async () => {
    req.files = [{}, {}, {}, {}];

    await ProductControllers.createProduct(req, res, () => {});
    expect.assertions(2);
    expect(S3Util.uploadFileToS3).toHaveBeenCalledTimes(1);
    expect(S3Util.uploadFileToS3).toHaveBeenCalledWith(req.files, 'image');
  });
});

describe('Test Product Controller - create - ')

describe('Test Product Controller - create - calling PhotoModel.addProduct', () => {
  beforeEach(()=>{
    // INFO Mock validationResult return { isEmpty: () => true}
    validationResult.mockReturnValue({
      isEmpty: () => true,
      errors: [],
    })
  })
});
