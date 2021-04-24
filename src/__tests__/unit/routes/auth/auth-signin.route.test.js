/**
 * TOPIC: sign in
 * -------------------
 * TODO Test 1.
 * SUB TOPIC: Validation message
 * INFO: Test if data sent by client is not meet the requirement the system will send back right error information (code + message + errors fields)
 * INFO: This also test that we implement all the validations needed for the systems
 * INFO: email(isEmail, not empty, trimed) / password(length > 6, not empty, trimed)
 * TODO Test 2 + 3
 * SUB TOPIC: All possible errors return with code and structure actually returned
 * INFO: 1. User not found / 2. wrong password
 *
 * TODO Test 4
 * SUB TOPIC: Successfully signin
 * INFO: Test that response data include all properties needed
 */

const request = require('supertest');
const mockEmployeeList = require('../../__mocks__/data/employees.json');

//INFO Mock model
jest.mock('../../../../models/employee.model');
const Employee = require('../../../../models/employee.model');

// INFO Mock database connection
jest.mock('../../../../models/index');
const db = require('../../../../models/index');

Employee.findAll = jest.fn();
// db = jest.fn().mockImplementation(() => true);
// db.mock;

let app;

describe('Test /api/signin', () => {
  beforeEach(async () => {
    db.mockReturnValue(Promise.resolve(true));
    // INFO Need to import here otherwise the db will not be mocked
    app = await require('../../../../index')();
  });
  afterEach(() => {
    // jest.restoreAllMocks();
    // jest.resetAllMocks();
    Employee.findAll.mockReset();
  });
  afterAll(()=>{
    db.resetMock();
  })
  it('should return http code "422", error message "Invalid input(s)", and an errors array back to client - if there are some input errors', async () => {
    // INFO send request
    const res = await request(app)
      .post('/api/signin')
      .send({ email: 'test1', password: 'pas' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(422);

    // INFO Test
    expect(res).toHaveProperty('statusCode', 422);
    expect(res.body.error).toHaveProperty('statusCode', 422);
    expect(res.body.error).toHaveProperty('msg', 'Invalid input(s)');
    expect(res.body.error.errors).toHaveLength(2);
  });

  it('should return http code "401", error message "Invalid credentails" back to client - if the email cannot found in the database"', async () => {
    // INFO Mock database to get data from mock data employees to return []
    Employee.findAll.mockResolvedValue([]);

    // INFO send request
    const res = await request(app)
      .post('/api/signin')
      .send({ email: 'test4@test.com', password: 'password' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(401);

    // INFO TEST
    expect(res).toHaveProperty('statusCode', 401);
    expect(res.body.error).toHaveProperty('statusCode', 401);
    expect(res.body.error).toHaveProperty('msg', 'Invalid credentails');
  });

  it('should return http code "401", error message "Invalid credentails" back to client - if the password does not match the one in database"', async () => {
    // INFO Mock database to get data from mock data employees
    Employee.findAll.mockResolvedValue([mockEmployeeList[0]]);

    // INFO send request
    const res = await request(app)
      .post('/api/signin')
      .send({ email: 'test1@test.com', password: 'wrong_password' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(401);

    // INFO TEST
    expect(res).toHaveProperty('statusCode', 401);
    expect(res.body.error).toHaveProperty('statusCode', 401);
    expect(res.body.error).toHaveProperty('msg', 'Invalid credentails');
  });

  it('should return http code "200", success message "Successfully logged in, userId, and token" back to client - if every"', async () => {
    // INFO Mock database to get data from mock data employees
    Employee.findAll.mockResolvedValue([mockEmployeeList[0]]);

    // INFO send request
    const res = await request(app)
      .post('/api/signin')
      .send({ email: 'test1@test.com', password: 'password' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);

    // INFO TEST
    expect(res.body).toHaveProperty('userId', mockEmployeeList[0].id);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('msg', 'Successfully logged in');
  });
});
