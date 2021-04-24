/**
 * TOPIC: Create product Route
 * -------------------------
 *
 * TODO: Test 1
 * SUB TOPIC: It must validate all inputs
 * INFO: name must be not empty, should return status 422 with msg "Invalid input(s)" and errors array contain one member with paramr "name" and msg "must not be empty"
 *
 * TODO: Test 2
 * SUB TOPIC: It must validate all inputs
 * INFO: name must be at least 3 characters, should return status 422 with msg "Invalid input(s)" and errors array contain one member with paramr "name" and msg "name must be at least 3 characters"
 *
 * TODO: Test 3
 * SUB TOPIC: It should call category.create if valid input
 * INFO: it should call create on category model with valid category name in Capital letter style
 * 
 * TODO: Test 4
 * SUB TOPIC: It should return correct data to client
 * INFO: return status code "201" with category object { id: number, name: string, createdAt: UTC, updatedAt: UTC - if everything is validated
 */

// INFO import
const request = require('supertest');
const {
  ERROR_MSG,
  VALIDATION_MSG,
} = require('../../../../configs/error-messages');

// INFO mocks
jest.mock('../../../../models/category.model');
const CategoryModel = require('../../../../models/category.model');

jest.mock('../../../../models/index');
const db = require('../../../../models/index');

const mockCategoryDatas = require('../../__mocks__/data/category.json');

let app;

describe('Test POST /api/category', () => {
  beforeAll(async () => {
    db.mockImplementation(() => Promise.resolve(true));
    app = await require('../../../../index')();
  });
  it('should return status 422 with msg "Invalid input(s)" and errors array contain one member with param "name" and msg "must not be empty - if name is empty', async () => {
    const res = await request(app)
      .post('/api/category')
      .send({ name: '' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(422);

    expect.assertions(7);
    expect(res).toHaveProperty('statusCode', 422);
    const error = res.body.error;
    expect(error).toHaveProperty('msg', ERROR_MSG.INVALID_INPUTS);
    expect(error).toHaveProperty('errors');
    expect(error.errors).toHaveLength(1);
    expect(error.errors[0]).toHaveProperty('location', 'body');
    expect(error.errors[0]).toHaveProperty('msg', VALIDATION_MSG.EMPTY);
    expect(error.errors[0]).toHaveProperty('param', 'name');
  });

  it('should return status 422 with msg "Invalid input(s)" and errors array contain one member with paramr "name" and msg "name must be at least 3 characters" - if name is less than 3 characters', async () => {
    const res = await request(app)
      .post('/api/category')
      .send({ name: 'b1' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(422);

    expect.assertions(7);
    expect(res).toHaveProperty('statusCode', 422);
    const error = res.body.error;
    expect(error).toHaveProperty('msg', ERROR_MSG.INVALID_INPUTS);
    expect(error).toHaveProperty('errors');
    expect(error.errors).toHaveLength(1);
    expect(error.errors[0]).toHaveProperty('location', 'body');
    expect(error.errors[0]).toHaveProperty(
      'msg',
      VALIDATION_MSG.IS_LENGTH_MIN(3)
    );
    expect(error.errors[0]).toHaveProperty('param', 'name');
  });

  it('should call create on category model with valid category name in Capital letter style', async () => {
    CategoryModel.create.mockReturnValue({});
    await request(app)
      .post('/api/category')
      .send({ name: 'This IS CatNamE' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(201);

    expect.assertions(2);
    expect(CategoryModel.create).toHaveBeenCalledTimes(1);
    expect(CategoryModel.create).toHaveBeenCalledWith({
      name: 'This is catname',
    });
  });

  it('should return status code "201" with category object { id: number, name: string, createdAt: UTC, updatedAt: UTC - if everything is validated', async () => {
    CategoryModel.create.mockReturnValue(mockCategoryDatas[0]);
    const res = await request(app)
      .post('/api/category')
      .send({ name: 'category 1' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(201);

    expect.assertions(6);
    expect(res).toHaveProperty('statusCode', 201);
    expect(res.body).toHaveProperty('createdCategory');
    const { createdCategory } = res.body;
    expect(createdCategory).toHaveProperty('id', 1);
    expect(createdCategory).toHaveProperty('name','Category 1');
    expect(createdCategory).toHaveProperty('createdAt');
    expect(createdCategory).toHaveProperty('updatedAt');
  });
});
