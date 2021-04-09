/**
 * TOPIC: Create product Controller
 * -------------------------
 *
 * TODO: Test 1
 * SUB TOPIC: Test it is a function
 * INFO: It must be a function
 *
 * TODO: Test 2
 * SUB TOPIC: Test validator code and message
 * INFO: The function should return correct code and error structure
 *
 * TODO: Test 3
 * SUB TOPIC: Test CategoryModel create funtion is called only once
 * INFO: should call CategoryModel.create() only once and with Capitalized word
 *
 * TODO: Test 4
 * SUB TOPIC: Test if CategoryModel create return invalid data it should throw error
 * INFO: The function should throw an error if CategoryModel.create return something unusual
 *
 * TODO: Test 5
 * SUB TOPIC: Test if everything success
 * INFO: The function should return status "201" and created category object back to client
 */

// INFO Import function
const CategoryControllers = require('../../../../controllers/category.controllers');

// INFO Mocks
jest.mock('express-validator');
const { validationResult } = require('express-validator');
const validationResultErrorsMock = require('../../__mocks__/data/validationResult.json');

jest.mock('../../../../models/category.model');
const CategoryModel = require('../../../../models/category.model');
const sequelizeValidationErrorObj = require('../../__mocks__/data/sequelizeContrainError.json');

const httpMock = require('node-mocks-http');
const req = httpMock.createRequest();
let res;

describe('Test Category Controllers - create - function', () => {
  it('should be a function', () => {
    expect.assertions(1);
    expect(typeof CategoryControllers.createCategory).toBe('function');
  });
});

describe('Test Category Controllers - create - vaidator', () => {
  beforeEach(() => {
    validationResult.mockReturnValue({
      isEmpty: () => false,
      ...validationResultErrorsMock,
    });
  });
  it('should call validationResult function once', async () => {
    await CategoryControllers.createCategory(req, res, () => {});

    expect.assertions(2);
    expect(validationResult).toHaveBeenCalledTimes(1);
    expect(validationResult).toHaveBeenCalledWith(req);
  });
  it('should throw an error code "422" with message "Invalid input(s)", and errors array back to client - if validation failed', async () => {
    let err;
    await CategoryControllers.createCategory(req, res, (error) => {
      err = error;
    });

    expect.assertions(8);
    expect(err).toHaveProperty('statusCode', 422);
    expect(err).toHaveProperty('message', 'Invalid input(s)');
    expect(err).toHaveProperty('errors');
    expect(err.errors).toBeInstanceOf(Array);
    expect(err.errors).toHaveLength(2);
    expect(err.errors[0]).toHaveProperty('location');
    expect(err.errors[0]).toHaveProperty('msg');
    expect(err.errors[0]).toHaveProperty('param');
  });
});

describe('Test Category Controllers - create - insert into database', () => {
  beforeAll(() => {
    // INFO Mock ProductModel.create()
    CategoryModel.create = jest.fn();
    req.body.name = 'soME cateGory NamE';
  });
  beforeEach(() => {
    res = httpMock.createResponse();
    validationResult.mockReturnValue({
      isEmpty: () => true,
      errors: [],
    });
  });
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should call funtion create from CategoryModel only once with capitalized word or phase', async () => {
    CategoryModel.create.mockReturnValue([]);

    await CategoryControllers.createCategory(req, res, () => {});

    expect.assertions(2);
    expect(CategoryModel.create).toHaveBeenCalledTimes(1);
    expect(CategoryModel.create).toHaveBeenCalledWith({
      name: 'Some category name',
    });
  });

  it('should throw an error if CategoryModel.create return something unusual', async () => {
    CategoryModel.create.mockReturnValue(undefined);

    let err;
    await CategoryControllers.createCategory(req, res, (error) => {
      err = error;
    });
    expect.assertions(2);
    expect(err).toBeInstanceOf(Error);
    expect(err).toHaveProperty('message', '');
  });

  it('should return status "201" and created category object back to client', async () => {
    CategoryModel.create.mockReturnValue({
      id: 1,
      name: 'Some category name',
      updatedAt: '2021-04-09T18:02:07.741Z',
      createdAt: '2021-04-09T18:02:07.741Z',
    });

    await CategoryControllers.createCategory(req, res, () => {});

    expect.assertions(6);
    expect(res).toHaveProperty('statusCode', 201);
    const data = res._getJSONData();
    expect(data).toHaveProperty('createdCategory');
    expect(data.createdCategory).toHaveProperty('id', 1);
    expect(data.createdCategory).toHaveProperty('name', 'Some category name');
    expect(data.createdCategory).toHaveProperty(
      'updatedAt',
      '2021-04-09T18:02:07.741Z'
    );
    expect(data.createdCategory).toHaveProperty(
      'createdAt',
      '2021-04-09T18:02:07.741Z'
    );
  });
});
