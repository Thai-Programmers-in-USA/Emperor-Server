/**
 * TOPIC: Create product Route
 * -------------------------
 *
 * TODO: Test 1
 * SUB TOPIC: It must validate all inputs
 * INFO: name must be not empty / at least 3 character / should return status 422 with msg and errors array
 */

// INFO import
const request = require('supertest');
const app = require('../../../../index');

// INFO mocks

describe('it should return status "422" with correct msg and errors array - if client send unprocessable "name"', async () => {});
