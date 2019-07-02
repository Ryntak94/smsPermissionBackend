
exports.up = function(knex, Promise) {
  return knex.schema.createTable('studentFieldTripJoin',    table   =>  {
      table.increments();
      table
        .integer("fieldTrip_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("fieldTrips")
        .onDelete("CASCADE")
        .onUpdate("CASCADE")
    table
      .integer("student_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("students")
      .onDelete("CASCADE")
      .onUpdate("CASCADE")

  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('studentFieldTripJoin')
};
