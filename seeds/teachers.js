
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('teachers').del()
    .then(function () {
      // Inserts seed entries
      return knex('teachers').insert([
        {name: 'Leroy'},
        {name: 'Ryan'},
        {name: 'Rodean'},
        {name: 'Jason'}
      ]);
    });
};
