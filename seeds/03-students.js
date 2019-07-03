
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('students').del()
    .then(function () {
      // Inserts seed entries
      return knex('students').insert([
        {
          name: "Student 1",
          teacher_id: 1,
          guardian_id: 1
        },
        {
          name: "Student 2",
          teacher_id: 2,
          guardian_id: 1
        },
        {
          name: "Student 3",
          teacher_id: 3,
          guardian_id: 2
        },
        {
          name: "Student 4",
          teacher_id: 4,
          guardian_id: 2
        },
        {
          name: "Student 5",
          teacher_id: 1,
          guardian_id: 3
        },
        {
          name: "Student 6",
          teacher_id: 2,
          guardian_id: 3
        },
        {
          name: "Student 7",
          teacher_id: 3,
          guardian_id: 4
        },
        {
          name: "Student 8",
          teacher_id: 4,
          guardian_id: 4
        }
      ]);
    });
};
