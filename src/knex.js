const knex = require('knex')({
  client: 'mysql',
  connection: {
    host: '127.0.0.1',
    user: 'gracekimotho',
    password: '',
    database: 'population'
  }
});

module.exports =  knex;
