exports.up = async (knex) => {
  await knex.schema.createTable('Announcements', (table) => {
    table.integer('ann_id').unique().notNullable();
    table.string('title').notNullable();
    table.string('desc').notNullable();
    table.string('teacher_name').notNullable();
    table.timestamp('created_at');

    table.primary('ann_id');
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTable('Announcements');
};
