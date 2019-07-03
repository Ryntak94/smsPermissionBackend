exports.up = function(knex, Promise) {
  return knex.schema.createTable("teachers", table => {
    table.increments();
    table.string("name").notNullable();
    table.string("email").notNullable();
    table.string("password").notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("teachers");
};
