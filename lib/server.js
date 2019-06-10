'use strict';

const Hapi = require('@hapi/hapi');
const routes = require('../src/routes');

const server = Hapi.server({
  port: 3001,
  host: 'localhost'
});

server.route(routes);

exports.init = async () => {
    await server.initialize();
    return server;
};


exports.main = async () => {
    await server.start();
    return server;
};
