'use strict';

const Hapi = require('@hapi/hapi');
const routes = require('../src/routes');

const server = Hapi.server({
  port: 3001,
  host: 'localhost'
});


exports.main = async () => {
    routes.forEach((route) => {
      server.route(route)
    });

    await server.initialize();

    await server.start();
    return server;
};
