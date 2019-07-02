
exports.up = function(knex, Promise) {
  return knex.schema.createTable('teachers',    table   =>  {
      table.increments();
      table.string('name').notNullable();
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('teachers')
};
