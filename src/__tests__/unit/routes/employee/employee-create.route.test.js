/**
 * TOPIC: create employee
 * -------------------
 * TODO Test 1.
 * TOPIC: Authorization level
 * INFO: Test that it should not proceed if authorizationLevel is not admin
 *
 * TODO Test 2.
 * TOPIC: Validation Error
 * INFO: Test sever should return code "422" with message "Invalid input(s)", and errors array - if there are some input error and all neccessary fields should be validated
 *
 * TODO Test 3.
 * TOPIC: bcrypt has function called once with password and 12
 * INFO: Test that server should call brcypt to hash the password once with password from client and salt value 12
 *
 * TODO Test 4.
 * TOPIC: Employee create error
 * INFO: Test that server should return code "500" with message "Internal server errors" to the client - if database connection  failed or throw error out of Employee.create.
 *
 * TODO Test 5.
 * TOPIC: Successfully created an Employee
 * INFO: Test that server should return successfully response with code "200", message "Successfully created an employee, and createdEmployee object without password and authorizationLevel"
 */

// INFO Import libraries
const request = require('supertest');

// INFO Import modules

// INFO Mocks
const mockEmployeeList = require('../../__mocks__/data/employees.json');

// SUB TOPIC: mock database connection
jest.mock('../../../../models/index');
const db = require('../../../../models/index');

// SUB TOPIC: mock bcrypt
const bcrypt = require('bcrypt');

// SUB TOPIC: mock Employee DAO
jest.mock('../../../../models/employee.model');
const Employee = require('../../../../models/employee.model');
Employee.create = jest.fn();

describe('Test post /api/employee', () => {
  beforeAll(async () => {
    // INFO mock database connection
    db.mockResolvedValue(true);
    app = await require('../../../../index')();
  });
  afterEach(() => {});

  // it('should not allow the employee with out admin authorization to proceed', async () => {

  // });

  it('should validate all neccesary fields and return code "422" with message "Invalid input(s)", and errors array - if there are some input error', async () => {
    // INFO calling api with bad data
    let res = await request(app)
      .post('/api/employee')
      .send({
        fName: '12',
        lName: '12',
        email: '1@',
        password: 'pass',
        authorizationLevel: 'something else',
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(422);

    // INFO Testing
    expect(res).toHaveProperty('statusCode', 422);
    expect(res.body.error).toHaveProperty('msg', 'Invalid input(s)');
    expect(res.body.error).toHaveProperty('errors');
    expect(res.body.error.errors).toBeInstanceOf(Array);
    expect(res.body.error.errors).toHaveLength(6);

    // INFO calling api with bad data
    res = await request(app)
      .post('/api/employee')
      .send({
        fName: '12',
        lName: '12',
        email: '1@',
        password: 'password',
        authorizationLevel: 'somethingelse',
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(422);

    expect(res.body.error.errors).toHaveLength(5);
  });

  it('should call bcrypt hash function once with password sent from client and salt value 12', async () => {
    // INFO Mock bcrypt hash function
    const bcryptHashSpy = jest.spyOn(bcrypt, 'hash');

    const res = await request(app)
      .post('/api/employee')
      .send(mockEmployeeList[2])
      .set('Accept', 'application/json');

    expect(bcryptHashSpy).toHaveBeenCalledTimes(1);
    expect(bcryptHashSpy).toHaveBeenCalledWith(
      mockEmployeeList[2].password,
      12
    );
  });

  it('should return code "500" with message "Internal server errors" to the client - if database connection  failed or throw error out of Employee.create.', async () => {
    // INFO Mock Employee create throw error
    Employee.create.mockRejectedValue(new Error());

    const res = await request(app)
      .post('/api/employee')
      .send(mockEmployeeList[2])
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(500);

    expect(res.body.error).toHaveProperty('msg', 'Internal server errors');
    expect(res.body.error).toHaveProperty('statusCode', 500);
  });

  it('should return successfully response with code "200", message "Successfully created an employee, and createdEmployee object without password and authorizationLevel', async () => {
    // INFO Mock Employee create return employee object
    Employee.create.mockResolvedValue(mockEmployeeList[3]);

    const res = await request(app)
      .post('/api/employee')
      .send(mockEmployeeList[2])
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(201);

    expect(res.body).toHaveProperty('msg', 'Successfully created an employee');
    expect(res.body).toHaveProperty('createdEmployee');
    expect(res.body.createdEmployee).not.toHaveProperty('password');
    expect(res.body.createdEmployee).not.toHaveProperty('authenticationLevel');
    expect(res.body.createdEmployee).toHaveProperty('id', "3");
    expect(res.body.createdEmployee).toHaveProperty('fName', 'Test3_firstName');
    expect(res.body.createdEmployee).toHaveProperty('lName', 'Test3_lastName');
    expect(res.body.createdEmployee).toHaveProperty('email', 'test3@test.com');
    expect(res.body.createdEmployee).toHaveProperty('createdAt', '2021-03-28T13:09:50.000Z');
    expect(res.body.createdEmployee).toHaveProperty('updatedAt', '2021-04-13T13:07:34.000Z');
  });
});
