
exports.seed = function(knex, Promise) {

  const tableName = 'residents';

  const rows = [
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

  return knex( tableName )
    .del()
    .then(function () {
      return knex.insert( rows ).into( tableName );
    });
};
