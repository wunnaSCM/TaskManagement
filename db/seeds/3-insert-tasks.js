/* eslint-disable camelcase */
exports.seed = function (knex) {
  // Delete ALL existing entries
  return knex('tasks')
    .del()
    .then(function () {
      // Insert seed entries
      return knex('tasks').insert([
        {
          project: 4,
          title: 'Post Update',
          description: 'Edit posts page ui design',
          type: 'app',
          assignedEmployee: 2,
          estimateHour: 16,
          actualHour: 16,
          status: 0,
          estimateStartDate: '2023-04-04 08:00:00',
          estimateEndDate: '2023-04-04 17:00:00',
          reviewer: 3,
          reviewEstimateHour: 16,
          reviewActualHour: 16,
          reviewEstimateStartDate: '2023-04-04 08:00:00',
          reviewEstimateEndDate: '2023-04-04 17:00:00',
          created_at: '2023-05-01 13:30:00',
          updated_at: '2023-05-01 13:30:00',
        },
        {
          project: 1,
          title: 'Cinema Create',
          description: 'Create crinema ui design',
          type: 'cms',
          assignedEmployee: 1,
          estimateHour: 4,
          actualHour: 4,
          status: 3,
          estimateStartDate: '2023-04-04 08:00:00',
          estimateEndDate: '2023-04-04 17:00:00',
          reviewer: 3,
          reviewEstimateHour: 4,
          reviewActualHour: 4,
          reviewEstimateStartDate: '2023-04-04 08:00:00',
          reviewEstimateEndDate: '2023-04-04 17:00:00',
          created_at: '2023-05-01 13:30:00',
          updated_at: '2023-05-01 13:30:00',
        },
        {
          project: 2,
          title: 'Post Create',
          description: 'Create posts ui design',
          type: 'app',
          assignedEmployee: 3,
          estimateHour: 8,
          actualHour: 12,
          status: 1,
          estimateStartDate: '2023-04-04 08:00:00',
          estimateEndDate: '2023-04-04 17:00:00',
          reviewer: 3,
          reviewEstimateHour: 8,
          reviewActualHour: 12,
          reviewEstimateStartDate: '2023-04-04 08:00:00',
          reviewEstimateEndDate: '2023-04-04 17:00:00',
          created_at: '2023-05-01 13:30:00',
          updated_at: '2023-05-01 13:30:00',
        },
      ]);
    });
};
