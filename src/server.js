'use strict';

const routes = require('./routes');
const Hapi = require('@hapi/hapi');

const server = Hapi.server({
  port: 3001,
  host: 'localhost',
  router: {
    stripTrailingSlash: true
  }
});

exports.main = async () => {
  await server.register(require('@hapi/cookie'));

  server.auth.strategy('restricted', 'cookie', {
    cookie: {
      name: 'sid-example',
      password: '2b10lNNeGc57dwFUV3BKuIQlBZdiy55TGBYybLx0SjBPsiAJ6oye2aNW',
      isSecure: false
    },
    redirectTo: '/auth'
  });

  routes.forEach((route) => {
    server.route(route)
  });

  await server.initialize();

  await server.start();

  return server;
}
