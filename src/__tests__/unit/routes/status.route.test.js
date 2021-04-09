const request = require('supertest');

// INFO Mock db connection
jest.mock('../../../models/index');
const db = require('../../../models/index');

describe('Test /status', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });
  afterAll(() => {
    db.resetMock();
  });
  it('should return Server is running', async () => {
    db.mockReturnValue(Promise.resolve(true));
    const app = await require('../../../index')();
    const res = await request(app).get('/status');
    expect(res.text).toBe('Server is running');
  });
});
