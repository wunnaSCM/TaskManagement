/* eslint-disable camelcase */
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('reports').del();
  await knex('reports').insert([
    {
      description:
        'Name: Teset\nProject 2\n-Task 3 <40%><Test><Finish><4hr>\n-Task 5 <50%><CD><In Progress><6hr>',
      report_to: 1,
      report_by: 2,
      date: '2023-05-04',
    },
    {
      description:
        'Name: Zeus\nProject 1\n-Task 3 <40%><Test><Finish><4hr>\n-Task 5 <50%><CD><In Progress><6hr>',
      report_to: 1,
      report_by: 3,
      date: '2023-05-05',
    },
  ]);
};
