exports.up = async (knex) => {
  await knex.schema.createTable('Users', (table) => {
    table.increments('user_id');
    table.string('type', 20).notNullable();
    table.string('name').notNullable();
    table.string('email').notNullable();
    table.string('password').notNullable();
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTable('Users');
};
