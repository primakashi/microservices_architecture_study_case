exports.up = async (knex) => {
  await knex.schema.createTable('Announcements', (table) => {
    table.increments('ann_id');
    table.string('title').notNullable();
    table.string('desc').notNullable();
    table.integer('teacher_id').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTable('Announcements');
};
