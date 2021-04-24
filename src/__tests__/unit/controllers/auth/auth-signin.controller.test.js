/**
 * TOPIC: sign in
 * -------------------
 * TODO Test 1.
 * SUB TOPIC: Validation message
 * INFO: Test the validation method send back to user with the right information (code + message)
 * TODO Test 2.
 * SUB TOPIC: Authentication error check
 * INFO: Test if the user put the wrong email address (not in db) and/or unmatched password system will return the write message information (code + message)
 * TODO Test 3.
 * SUB TOPIC: If everything correct
 * INFO: Test if everything correct user should be granted the authentication and receive jwt-token (code + messaege + jwt-token + userId)
 *
 */

// INFO Import libraries
const bcrypt = require('bcrypt');
const httpMock = require('node-mocks-http');

// INFO Import modules
const AuthControllers = require('../../../../controllers/auth.controllers');
const Employee = require('../../../../models/employee.model');
const mockEmployeeList = require('../../__mocks__/data/employees.json');
// let { validationResult } = require('express-validator');

// INFO Mocking
let req, res, next;
req = httpMock.createRequest();
req.body.email = '1@1.com';
req.body.password = 'password';
res = httpMock.createResponse();
next = () => {};

describe('Test | Auth Controller - Sign in function', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });
  beforeEach(() => {
    // expressValidator.mockImplementation(() => ({ validationResult }));
  });

  it('should be a function', () => {
    expect(typeof AuthControllers.signin).toBe('function');
  });

  // it('should return error code "422" with message "Invalid input(s)" and array of fields that are not validated', async () => {
  //   // TODO 1. Mock validationresult to return errors
  //   validationResult = jest.fn().mockImplementation(() => false);

  //   // validationResultSpy.mockReturnValue({ isEmpty: () => false });
  //   const result = await AuthControllers.signin(req, res, next);
  //   console.log(result);
  //   expect(result).toBeInstanceOf(Error);
  //   expect(result).toHaveProperty('statusCode', 422);
  // });

  it('should have been called just once', async () => {
    const findAllSpy = jest.spyOn(Employee, 'findAll');
    findAllSpy.mockReturnValue([]);
    await AuthControllers.signin(req, res, next);
    expect(findAllSpy).toHaveBeenCalledTimes(1);
    expect(findAllSpy).toHaveBeenCalledWith({
      where: { email: req.body.email },
    });
  });

  it('should return error code "401" with message "Invalid credentials" back - if cannot find user with input email', async () => {
    const findAllSpy = jest.spyOn(Employee, 'findAll');
    findAllSpy.mockReturnValue([]);
    const result = await AuthControllers.signin(req, res, next);
    expect(result).toBeInstanceOf(Error);
    expect(result).toHaveProperty('statusCode', 401);
    expect(result).toHaveProperty('message', 'Invalid credentails');
  });

  it('should return error code "401" with message "Invalid credentials" back - if the password is wrong', async () => {
    // INFO Mock functions
    const findAllSpy = jest.spyOn(Employee, 'findAll');
    findAllSpy.mockReturnValue([mockEmployeeList[0]]);
    const compareSpy = jest.spyOn(bcrypt, 'compare');
    compareSpy.mockReturnValue(false);

    // INFO call function
    const result = await AuthControllers.signin(req, res, next);
    expect(result).toBeInstanceOf(Error);
    expect(result).toHaveProperty('statusCode', 401);
    expect(result).toHaveProperty('message', 'Invalid credentails');
  });

  it('should return successful message with code "200", user id, and token back to client - if the user is authenticated', async () => {
    const findAllSpy = jest.spyOn(Employee, 'findAll');
    findAllSpy.mockReturnValue([mockEmployeeList[0]]);
    const compareSpy = jest.spyOn(bcrypt, 'compare');
    compareSpy.mockReturnValue(true);

    await AuthControllers.signin(req, res, next);
    expect(res).toHaveProperty('statusCode', 200);
    const data = res._getJSONData();
    expect(data).toHaveProperty('msg', 'Successfully logged in');
    expect(data).toHaveProperty('token');
    expect(data).toHaveProperty('userId', '1');
  });
});
