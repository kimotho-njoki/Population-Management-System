
exports.seed = function(knex, Promise) {

  const tableName = 'users';

  const rows = [
    {
      userID: 1,
      username: 'JaneDoe',
      password: 'password'
    }
  ];

  return knex( tableName )
    .del()
    .then(function () {
      return knex.insert( rows ).into( tableName );
    });
};
