/* eslint-disable camelcase */
exports.seed = function (knex) {
  // Delete ALL existing entries
  return knex('projects')
    .del()
    .then(function () {
      // Insert seed entries
      return knex('projects').insert([
        {
          name: 'Project 1',
          language: 'English',
          description: 'This is testing Project',
          start_date: '2023-04-28',
          end_date: '2023-05-28',
          created_at: '2023-01-01 13:30:00',
          updated_at: '2023-01-01 13:30:00',
        },
        {
          name: 'Project 2',
          language: 'English',
          description: 'This is testing Project',
          start_date: '2023-04-28',
          end_date: '2023-05-28',
          created_at: '2023-01-01 13:30:00',
          updated_at: '2023-01-01 13:30:00',
        },
        {
          name: 'Project 3',
          language: 'Japanese',
          description: 'This is testing Project',
          start_date: '2023-04-28',
          end_date: '2023-05-28',
          created_at: '2023-01-01 13:30:00',
          updated_at: '2023-01-01 13:30:00',
        },
        {
          name: 'Project 4',
          language: 'English',
          description: 'This is testing Project',
          start_date: '2023-04-28',
          end_date: '2023-05-28',
          created_at: '2023-01-01 13:30:00',
          updated_at: '2023-01-01 13:30:00',
        },
        {
          name: 'Project 5',
          language: 'Japanese',
          description: 'This is testing Project',
          start_date: '2023-04-28',
          end_date: '2023-05-28',
          created_at: '2023-01-01 13:30:00',
          updated_at: '2023-01-01 13:30:00',
        },
      ]);
    });
};
