exports.up = async (knex) => {
  return knex.schema.createTable('employees', (table) => {
    table.increments('id');
    table.string('name').notNullable();
    table.string('email').notNullable();
    table.string('password').notNullable();
    table.string('photo');
    table.string('address').notNullable();
    table.string('phone').notNullable();
    table.date('dob').notNullable();
    table.integer('position').notNullable();
    table.datetime('createdAt').notNullable();
    table.datetime('updatedAt').notNullable();
    table.datetime('deletedAt');
  });
};

exports.down = async (knex) => {
  await knex.raw('DROP TABLE employees CASCADE');
  return;
};