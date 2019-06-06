
exports.seed = function(knex, Promise) {

  const tableName = 'sublocations';

  const rows = [
    {
      sublocationID: 1,
      sublocation_name: 'Roysambu',
      belongs_to: 1
    }
  ];

  return knex( tableName )
    .del()
    .then(function () {
      return knex.insert( rows ).into( tableName );
    });
};
