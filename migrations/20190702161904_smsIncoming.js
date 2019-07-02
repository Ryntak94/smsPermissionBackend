
exports.up = function(knex, Promise) {
  return knex.schema.createTable('smsIncoming',    table   =>  {
      table.increments();
      table.string("response").notNullable()
      table
        .integer("smsOutgoing_ID")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("smsOutgoing")
        .onDelete("CASCADE")
        .onUpdate("CASCADE")

  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('smsIncoming')
};
