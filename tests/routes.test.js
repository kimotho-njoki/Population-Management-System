'use strict';

const Lab = require('@hapi/lab');
const { expect } = require('@hapi/code');
const { afterEach, beforeEach, describe, it } = exports.lab = Lab.script();
const { init } = require('../lib/server');

describe('Routes tests, GET requests', () => {
  let server;

  beforeEach(async () => {
    server = await init();
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

  it('responds with status code of 200 and a payload for a sublocations GET request', async() => {

    const res = await server.inject({
      method: 'GET',
      url: '/sublocations'
    });

    const expectedpayload = [{
      sublocation_name: "Roysambu",
      sublocationID: 1,
      belongs_to: 1
    }];

    expect(res.statusCode).to.equal(200);
    expect(res.payload).to.equal(JSON.stringify(expectedpayload))
  });

  it('responds with status code of 200 and a payload for a residents GET request', async() => {

    const res = await server.inject({
      method: 'GET',
      url: '/residents'
    });

    const expectedpayload = [
      {
        residentID: 1,
        resident_name: 'John Doe',
        age: 30,
        gender: 'male',
        resident_of_location: 1
      },
      {
        residentID: 2,
        resident_name: 'John Smith',
        age: 28,
        gender: 'female',
        resident_of_location: 1
      }
    ];

    expect(res.statusCode).to.equal(200);
    expect(res.payload).to.equal(JSON.stringify(expectedpayload))
  });
});

describe('Routes tests, POST requests', () => {
  let server;

  beforeEach(async () => {
    server = await init();
  });

  afterEach(async () => {
    await server.stop();
  });

  it('responds with a response for a residents POST request', async() => {

    const res = await server.inject({
      method: 'POST',
      url: '/residents/1',
      payload: {
        resident_name: "Betty Petty",
        age: "34",
        gender: "female"
      }
    });

    expect(res.payload).to.equal("Resident added successfully")
  });

  it('responds a response for a sublocations POST request', async() => {

    const res = await server.inject({
      method: 'POST',
      url: '/sublocations/1',
      payload: {
        sublocation_name: "Kasarani"
      }
    });

    expect(res.statusCode).to.equal(200);
    expect(res.payload).to.equal("Sublocation created successfully")
  });

  it('responds with a response for a locations POST request', async() => {

    const res = await server.inject({
      method: 'POST',
      url: '/locations',
      payload: {
        location_name: "Nyeri"
      }
    });

    expect(res.payload).to.equal("Location created successfully")
  });
});

describe('Routes tests, PUT requests', () => {
  let server;

  beforeEach(async () => {
    server = await init();
  });

  afterEach(async () => {
    await server.stop();
  });

  it('responds with a response for a locations PUT request', async() => {

    const res = await server.inject({
      method: 'PUT',
      url: '/locations/1',
      payload: {
        location_name: "Kisumu"
      }
    });

    expect(res.payload).to.equal("Location updated successfully.")
  });

  it('responds a response for a sublocations PUT request', async() => {

    const res = await server.inject({
      method: 'PUT',
      url: '/sublocations/1',
      payload: {
        sublocation_name: "Kawangware"
      }
    });

    expect(res.payload).to.equal("Sublocation updated successfully.")
  });

  it('responds with a response for a residents PUT request', async() => {

    const res = await server.inject({
      method: 'PUT',
      url: '/residents/1',
      payload: {
        resident_name: "Hannah Wanjiku",
        age: "70",
        gender: "female"
      }
    });

    expect(res.payload).to.equal("Residents name, gender and age updated successfully.")
  });

  describe('Routes tests, DELETE requests', () => {
    it('responds with a response for a residents DELETE request', async() => {

      const res = await server.inject({
        method: 'DELETE',
        url: '/residents/1'
      });

      expect(res.payload).to.equal("Resident deleted successfully.")
    });

    it('responds with a response for a residents DELETE request', async() => {

      const res = await server.inject({
        method: 'DELETE',
        url: '/sublocations/1'
      });

      expect(res.payload).to.equal("Sublocation deleted successfully.")
    });

    it('responds with a response for a residents DELETE request', async() => {

      const res = await server.inject({
        method: 'DELETE',
        url: '/locations/1'
      });

      expect(res.payload).to.equal("Location deleted successfully.")
    });
  });
});
