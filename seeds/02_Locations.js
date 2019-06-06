
exports.seed = function(knex, Promise) {

  const tableName = 'locations';

  const rows = [
    {
      locationID: 1,
      location_name: 'Nairobi',
      created_by: 1
    }
  ];

  return knex( tableName )
    .del()
    .then(function () {
      return knex.insert( rows ).into( tableName );
    });
};
