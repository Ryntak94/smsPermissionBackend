const bcrypt = require("bcryptjs");
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex("teachers")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("teachers").insert([
        {
          name: "Leroy",
          email: "leroy@email.com",
          password: bcrypt.hashSync("pass", 8)
        },
        {
          name: "Ryan",
          email: "ryan@email.com",
          password: bcrypt.hashSync("pass", 8)
        },
        {
          name: "Rodean",
          email: "rodean@email.com",
          password: bcrypt.hashSync("pass", 8)
        },
        {
          name: "Jason",
          email: "jason@email.com",
          password: bcrypt.hashSync("pass", 8)
        }
      ]);
    });
};
