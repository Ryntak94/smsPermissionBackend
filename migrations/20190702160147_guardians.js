
exports.up = function(knex, Promise) {
  return knex.schema.createTable('guardians',    table   =>  {
      table.increments();
      table.string('name').notNullable();
      table.string('contact').notNullable();
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('guardians')
};
