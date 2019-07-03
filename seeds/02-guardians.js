
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('guardians').del()
    .then(function () {
      // Inserts seed entries
      return knex('guardians').insert([
        {
          name: "Parent 1",
          contact: "5555555555"
        },
        {
          name: "Parent2",
          contact: "5555555554"
        },
        {
          name: "Parent3",
          contact: "5555555553"
        },
        {
          name: "Parent4",
          contact: "5555555552"
        }
      ]);
    });
};
