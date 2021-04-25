/**
 * TOPIC: jwt validation middleware
 * -------------------
 * TODO: Test 1
 * SUB TOPIC: It is a function
 * INFO: Test that this is a function
 *
 * TODO: Test 2
 * SUB TOPIC: Validate Header Authorization field
 * INFO: return code "401" with msg "Not Authorized"
 *
 * TODO: Test 3
 * SUB TOPIC: Validate Token type
 * INFO: return code "401" with msg "Not Authorized"
 *
 * TODO: Test 4
 * SUB TOPIC: Validate Token is present
 * INFO: return code "401" with msg "Not Authorized"
 *
 * TODO: Test 5
 * SUB TOPIC: jwt.verify should be call once with correct input
 * INFO: should call jwt.verify once with token and secret
 *
 * TODO: Test 6
 * SUB TOPIC: Validate jwt if it is existed
 * INFO: return code "401" with msg "Not Authorized"
 *
 * TODO: Test 7
 * SUB TOPIC: Successfully validate jwt token
 * INFO: it should add userId to req object and it should be type number
 */

// INFO: Import
const JWTGuard = require('../../../middlewares/jwt-validation');
const httpMocks = require('node-mocks-http');
const { ERROR_MSG } = require('../../../configs/error-messages');
const { SECRET_TOKEN } = require('../../../configs/config');

// INFO: Mocks
jest.mock('jsonwebtoken');
const jwt = require('jsonwebtoken');

const isJWTTokenVerify = require('../__mocks__/data/jwt-verified.json');

let req, res;

describe('JWT Validator', () => {
  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
  });
  afterEach(() => {
    jest.resetAllMocks();
  });
  it('should be a function', () => {
    expect.assertions(1);
    expect(typeof JWTGuard).toBe('function');
  });

  it('should return code "401" with msg "Not Authorized" - if there is no Authorization header attached', async () => {
    let err;
    await JWTGuard(req, res, (error) => {
      err = error;
    });
    expect.assertions(2);
    expect(err).toHaveProperty('statusCode', 401);
    expect(err).toHaveProperty('message', ERROR_MSG.NOT_AUTHORIZED);
  });

  it('should return code "401" with msg "Not Authorized" - if invalid token type', async () => {
    req = httpMocks.createRequest({
      headers: { Authorization: 'token' },
    });
    let err;
    await JWTGuard(req, res, (error) => {
      err = error;
    });
    expect.assertions(2);
    expect(err).toHaveProperty('statusCode', 401);
    expect(err).toHaveProperty('message', ERROR_MSG.NOT_AUTHORIZED);
  });

  it('should return code "401" with msg "Not Authorized" - if invalid token is not present', async () => {
    req = httpMocks.createRequest({
      headers: { Authorization: 'Bearer' },
    });
    let err;
    await JWTGuard(req, res, (error) => {
      err = error;
    });
    expect.assertions(2);
    expect(err).toHaveProperty('statusCode', 401);
    expect(err).toHaveProperty('message', ERROR_MSG.NOT_AUTHORIZED);
  });

  it('should call jwt.verify once with token and secret', async () => {
    jwt.verify.mockReturnValue(undefined);
    req = httpMocks.createRequest({
      headers: { Authorization: 'Bearer token' },
    });

    let err;
    await JWTGuard(req, res, (error) => {
      err = error;
    });
    expect.assertions(2);
    expect(jwt.verify).toHaveBeenCalledTimes(1);
    expect(jwt.verify).toHaveBeenCalledWith('token', SECRET_TOKEN);
  });

  it('should return code "401" with msg "Not Authorized" - unsuccessfully validate the token', async () => {
    jwt.verify.mockReturnValue(undefined);
    req = httpMocks.createRequest({
      headers: { Authorization: 'Bearer token' },
    });

    let err;
    await JWTGuard(req, res, (error) => {
      err = error;
    });
    expect.assertions(2);
    expect(err).toHaveProperty('statusCode', 401);
    expect(err).toHaveProperty('message', ERROR_MSG.NOT_AUTHORIZED);
  });

  it('it should add userId to req object and it should be type number', async () => {
    jwt.verify.mockReturnValue(isJWTTokenVerify);
    req = httpMocks.createRequest({
      headers: { Authorization: 'Bearer token' },
    });

    await JWTGuard(req, res, () => {});

    expect.assertions(2);
    expect(req).toHaveProperty('userId', isJWTTokenVerify.userId);
    expect(typeof req.userId).toBe('number');
  });
});
