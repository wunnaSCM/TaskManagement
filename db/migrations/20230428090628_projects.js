exports.up = async (knex) => {
  await knex.schema.createTable('projects', (table) => {
    table.increments('id');
    table.string('name').notNullable();
    table.string('language').notNullable();
    table.text('description');
    table.date('start_date');
    table.date('end_date');
    table.datetime('created_at').notNullable();
    table.datetime('updated_at').notNullable();
    table.datetime('deleted_at');
  });
};

exports.down = async (knex) => {
  await knex.raw('DROP TABLE projects CASCADE');
  return;
};
