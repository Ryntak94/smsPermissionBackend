
exports.up = function(knex, Promise) {
  return knex.schema.createTable('students',    table   =>  {
      table.increments();
      table.string('name').notNullable();
      table
        .integer("teacher_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("teachers")
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
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('students')
};
