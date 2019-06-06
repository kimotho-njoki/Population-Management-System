
exports.up = function(knex, Promise) {
  return knex.schema
                    .createTable('users', function(table) {
                      table.increments('userID').primary().notNullable();
                      table.string('username', 50).notNullable().unique;
                      table.string('password', 128).notNullable();
                    })
                    .createTable('locations', function(table) {
                      table.increments('locationID').primary().notNullable();
                      table.string('location_name').notNullable();
                      table.timestamp('created_at');
                      table.timestamp('updated_at');

                      table.integer('created_by')
                              .unsigned()
                              .references('userID')
                              .inTable('users')
                              .onDelete('CASCADE');
                    })
                    .createTable('sublocations', function(table) {
                      table.increments('sublocationID').primary().notNullable();
                      table.string('sublocation_name').notNullable();
                      table.timestamp('created_at');
                      table.timestamp('updated_at');

                      table.integer('belongs_to')
                              .unsigned()
                              .references('locationID')
                              .inTable('locations')
                              .onDelete('CASCADE');
                    })
                    .createTable('residents', function(table) {
                      table.increments('residentID').primary().notNullable();
                      table.string('resident_name').notNullable().unique;
                      table.integer('age', 3).notNullable();
                      table.string('gender', 10).notNullable();
                      table.timestamp('created_at');
                      table.timestamp('updated_at');

                      table.integer('resident_of_location')
                              .unsigned()
                              .references('locationID')
                              .inTable('locations')
                              .onDelete('CASCADE');;
                    });
};

exports.down = function(knex, Promise) {
  return knex.schema
                    .dropTableIfExists('users')
                    .dropTableIfExists('locations')
                    .dropTableIfExists('sublocations')
                    .dropTableIfExists('residents');
};
