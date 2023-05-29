exports.up = function(knex) {
  return knex.schema.createTable('notifications', (table) => {
    table.increments('id');
    table.integer('ownerId').unsigned().notNullable();
    table.string('title').notNullable();
    table.string('body').notNullable();
    table.boolean('checked').notNullable();
    table.datetime('created_at').notNullable();
    table.foreign('ownerId').references('employees.id');
  });
};

exports.down = async (knex) => {
  await knex.raw('DROP TABLE notifications CASCADE');
  return;
};