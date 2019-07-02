
exports.up = function(knex, Promise) {
  return knex.schema.createTable('smsOutgoing',    table   =>  {
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
      .integer("guardian_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("guardians")
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
  return knex.schema.dropTableIfExists('smsOutgoing')
};
