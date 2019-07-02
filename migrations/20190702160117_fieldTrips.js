
exports.up = function(knex, Promise) {
  return knex.schema.createTable('fieldTrips',    table   =>  {
      table.increments();
      table.string('name').notNullable();
      table.date('date').notNullable()
      table
        .integer("teacher_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("teachers")
        .onDelete("CASCADE")
        .onUpdate("CASCADE")

  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('fieldTrips')
};
