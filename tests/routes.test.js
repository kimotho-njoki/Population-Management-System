'use strict';
const Hapi = require('@hapi/hapi');
const Lab = require('@hapi/lab');
const { expect } = require('@hapi/code');
const { afterEach, beforeEach, describe, it } = exports.lab = Lab.script();
const { main } = require('../src/server');

describe('GET /locations', () => {
  let server;

  beforeEach(async () => {
    server = await main()
  });

  afterEach(async () => {
    await server.stop();
  });

  it('responds with status code of 200 and a payload for a locations GET request', async() => {

    const res = await server.inject({
      method: 'GET',
      url: '/locations'
    });

    const expectedpayload = [{
      locationID: 1,
      location_name: "Nairobi"
    }];

    expect(res.statusCode).to.equal(200);
    expect(res.payload).to.equal(JSON.stringify(expectedpayload))
  });
});
