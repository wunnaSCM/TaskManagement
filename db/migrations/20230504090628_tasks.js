exports.up = async (knex) => {
  return knex.schema.createTable('tasks', (table) => {
    table.increments('id');
    table.integer('project').unsigned().notNullable();
    table.string('title').notNullable();
    table.text('description');
    table.string('type');
    // Assigned Employee
    table.integer('assignedEmployee').unsigned().notNullable();
    table.float('estimateHour').notNullable();
    table.float('actualHour');
    table.integer('status'); // 0:Open, 1:In_Progress, 2:Finish, 3:Close
    table.datetime('estimateStartDate');
    table.datetime('estimateEndDate');
    table.datetime('actualStartDate');
    table.datetime('actualEndDate');
    table.integer('assignedEmployeePercent');
    //  Reviewer
    table.integer('reviewer').unsigned().notNullable();
    table.float('reviewEstimateHour').notNullable();
    table.float('reviewActualHour');
    table.datetime('reviewEstimateStartDate');
    table.datetime('reviewEstimateEndDate');
    table.datetime('reviewActualStartDate');
    table.datetime('reviewActualEndDate');
    table.integer('reviewerPercent');

    table.datetime('created_at').notNullable();
    table.datetime('updated_at').notNullable();
    table.foreign('project').references('projects.id').onDelete('CASCADE');
    table.foreign('assignedEmployee').references('employees.id');
    table.foreign('reviewer').references('employees.id');
  });
};

exports.down = async (knex) => {
  await knex.raw('DROP TABLE tasks CASCADE');
  return;
};
