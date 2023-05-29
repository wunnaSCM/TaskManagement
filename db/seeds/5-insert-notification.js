/* eslint-disable camelcase */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('notifications').del();
  await knex('notifications').insert([
    {ownerId: 1, title: 'New Report', body: 'You got a report from Test', checked: 1, created_at: '2023-05-05 13:30:00'},
    {ownerId: 1, title: 'New Report', body: 'You got a report from Zaw Htet Aung', checked: 0, created_at: '2023-05-04 13:30:00'},
  ]);
};
