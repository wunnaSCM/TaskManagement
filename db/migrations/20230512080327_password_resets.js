/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('password_resets', (table) => {
    table.increments('id');
    table.string('email').notNullable();
    table.string('token').notNullable();
    table.datetime('created_at').notNullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.raw('DROP TABLE password_resets CASCADE');
};
