const request = require('supertest');

// INFO Mock db connection
jest.mock('../../../models/index.js');
const db = require('../../../models/index');

describe('Test /status', () => {
  beforeEach(() => {
    db.mockReturnValue(Promise.resolve(true));
  });
  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });
  afterAll(() => {});
  it('should return Server is running', async () => {
    db.mockReturnValue(Promise.resolve(true));
    const app = await require('../../../index')();
    const res = await request(app).get('/status');
    expect(res.text).toBe('Server is running');
  });
});
