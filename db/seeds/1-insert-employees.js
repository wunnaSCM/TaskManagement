/* eslint-disable camelcase */
exports.seed = function (knex) {
  // Delete ALL existing entries
  return knex('employees')
    .del()
    .then(function () {
      // Insert seed entries
      return knex('employees').insert([
        {
          name: 'Wunna',
          email: 'scm.wunna@gmail.com',
          password:
            '$2b$10$UnGIfeIjqwgqwrqNumhu3O4Kny2qW86YPlan9ScmvLQF6sb1htjji',
          photo: '/img/employee/profile1.jpeg',
          address: 'Yangon',
          phone: '0945534534',
          dob: '1998-02-11',
          position: 0,
          createdAt: '2023-01-01 13:30:00',
          updatedAt: '2023-01-01 13:30:00',
        },
        {
          name: 'Zaw Htet Aung',
          email: 'scm.zawhtetaung@gmail.com',
          password:
            '$2b$10$UnGIfeIjqwgqwrqNumhu3O4Kny2qW86YPlan9ScmvLQF6sb1htjji',
          photo: '/img/employee/profile1.jpeg',
          address: 'Yangon',
          phone: '09791425608',
          dob: '1999-02-11',
          position: 0,
          createdAt: '2023-01-01 13:30:00',
          updatedAt: '2023-01-01 13:30:00',
        },
        {
          name: 'Test',
          email: 'test@gmail.com',
          password:
            '$2b$10$UnGIfeIjqwgqwrqNumhu3O4Kny2qW86YPlan9ScmvLQF6sb1htjji',
          photo: '/img/employee/profile1.jpeg',
          address: 'Yangon',
          phone: '0945534534',
          dob: '1998-02-11',
          position: 1,
          createdAt: '2023-01-01 13:30:00',
          updatedAt: '2023-01-01 13:30:00',
        },
        {
          name: 'Zeus',
          email: 'zeus@gmail.com',
          password:
            '$2b$10$UnGIfeIjqwgqwrqNumhu3O4Kny2qW86YPlan9ScmvLQF6sb1htjji',
          photo: '/img/employee/profile1.jpeg',
          address: 'Yangon',
          phone: '0945534534',
          dob: '1998-02-11',
          position: 1,
          createdAt: '2023-01-01 13:30:00',
          updatedAt: '2023-01-01 13:30:00',
        },
        {
          name: 'Vivian',
          email: 'vivian@gmail.com',
          password:
            '$2b$10$UnGIfeIjqwgqwrqNumhu3O4Kny2qW86YPlan9ScmvLQF6sb1htjji',
          photo: '/img/employee/profile1.jpeg',
          address: 'Yangon',
          phone: '0945534534',
          dob: '1999-04-02',
          position: 1,
          createdAt: '2023-01-01 13:30:00',
          updatedAt: '2023-01-01 13:30:00',
        },
      ]);
    });
};
