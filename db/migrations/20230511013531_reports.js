/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('reports', (table) => {
    table.increments('id');
    table.text('description');
    table.integer('report_to').unsigned().notNullable();
    table.integer('report_by').unsigned().notNullable();
    table.date('date');
    table.foreign('report_to').references('employees.id');
    table.foreign('report_by').references('employees.id');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.raw('DROP TABLE reports CASCADE');
};
