/**
 * TOPIC: create user
 * -------------------
 * TODO: Test 1
 * SUB TOPIC: It is a function
 * INFO: Test that this is a function
 * TODO: Test 2
 * SUB TOPIC: Validate inputs
 * INFO: Test the validation method send back to user with the right information (code + message)
 * TODO: Tes 3
 * SUB TOPIC: Generate hashed password
 * INFO: The bcrypt.hash should be calling with password from client and 12 as a salt
 * TODO: Test 4
 * SUB TOPIC: Create user failed
 * INFO: Test user creation failed, return (code + msg) 500 | Database connection error
 * TODO: Test 5
 * SUB TOPIC: Create user success
 * INFO: Test user creation success, return (code + msg) 200 | Successfully created user
 */

// INFO import libraries
const mockHttp = require('node-mocks-http');

// INFO import modules
const EmployeeControllers = require('../../../../controllers/employee.controllers');
const mockEmployeeList = require('../../__mocks__/data/employees.json');

// !-------------------------------------
// INFO Mocking

// SUB TOPIC: mocking Employee model
jest.mock('../../../../models/employee.model');
const Employee = require('../../../../models/employee.model');

// SUB TOPIC: mocking express-validation
jest.mock('express-validator');
const { validationResult } = require('express-validator');

// SUB TOPIC: mocking bcrypt hash
jest.mock('bcrypt');
const bcrypt = require('bcrypt');

// SUB TOPIC: mocking createError
// jest.mock('../../../utils/helper');
// const { createError } = require('../../../utils/helper');

// SUB TOPIC: Mocking http req and res, and next.
const req = mockHttp.createRequest();
req.body.fName = 'first_name';
req.body.lName = 'last_name';
req.body.email = '1@1.com';
req.body.password = 'password';
req.body.phone = '713-888-5555';
req.body.authenticationLevel = 'editor';
const res = mockHttp.createResponse();

describe('Test post /api/employee | (User Controller - createUser function)', () => {
  beforeEach(() => {});
  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });
  it('should be a function', () => {
    expect(typeof EmployeeControllers.createUser).toBe('function');
  });

  it('should return error code "422" with message "Invalid input(s)" back - if ', async () => {
    // INFO: mock validationResult to be invalid inputs
    validationResult.mockReturnValue({
      isEmpty: () => false,
      errors: [
        {
          location: 'body',
          msg: 'Invalid value',
          param: 'fName',
        },
        {
          location: 'body',
          msg: 'Invalid value',
          param: 'email',
        },
      ],
    });

    let err;

    await EmployeeControllers.createUser(req, res, (error) => {
      err = error;
    });
    expect(validationResult).toHaveBeenCalledTimes(1);
    expect(err).toBeInstanceOf(Error);
    expect(err).toHaveProperty('errors');
    expect(err.errors).toBeInstanceOf(Array);
    expect(err.errors).toHaveLength(2);
    expect(err).toHaveProperty('message', 'Invalid input(s)');
  });

  it('should generate hashed password with password sent from client and 12 as a salt', async () => {
    // INFO Mock validation result
    validationResult.mockReturnValue({
      isEmpty: () => true,
    });

    // INFO Mock bcrypt hash function
    const bcryptHashSpy = jest.spyOn(bcrypt, 'hash');
    bcryptHashSpy.mockResolvedValue('1234');

    // INFO calling function
    await EmployeeControllers.createUser(req, res, () => {});

    // INFO Testing
    expect(bcryptHashSpy).toHaveBeenCalledWith(req.body.password, 12);
    expect(bcryptHashSpy).toHaveBeenCalledTimes(1);
  });

  it('should return error code "500" - if connection to database failed', async () => {
    // INFO mock validationResult
    validationResult.mockReturnValue({
      isEmpty: () => true,
    });

    // INFO mock User.create
    const EmployeeCreateSpy = jest.spyOn(Employee, 'create');
    EmployeeCreateSpy.mockRejectedValue(new Error());

    let err;

    // INFO Call Function
    await EmployeeControllers.createUser(req, res, (error) => {
      err = error;
    });
    expect(err).toBeInstanceOf(Error);
    expect(err).toHaveProperty('statusCode', 500);
  });

  it('should response success code "201" with message "successfully created an employee, and the employee object with no password back to client"', async () => {
    // INFO mock validationResult
    validationResult.mockReturnValue({ isEmpty: () => true });

    // INFO mock User.create
    const EmployeeCreateSpy = jest.spyOn(Employee, 'create');
    EmployeeCreateSpy.mockResolvedValue(mockEmployeeList[0]);

    // INFO calling function
    await EmployeeControllers.createUser(req, res, () => {});

    // INFO Testing
    expect(res).toHaveProperty('statusCode', 201);
    const data = res._getJSONData();
    expect(data).toHaveProperty('msg', 'Successfully created an employee');
    expect(data).toHaveProperty('createdEmployee');
    expect(data.createdEmployee).not.toHaveProperty('password');
    expect(data.createdEmployee).toHaveProperty('id');
    expect(data.createdEmployee).toHaveProperty('fName');
    expect(data.createdEmployee).toHaveProperty('lName');
    expect(data.createdEmployee).toHaveProperty('email');
    expect(data.createdEmployee).toHaveProperty('createdAt');
    expect(data.createdEmployee).toHaveProperty('updatedAt');
  });
});
