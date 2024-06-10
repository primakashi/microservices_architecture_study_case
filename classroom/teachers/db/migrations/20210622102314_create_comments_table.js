exports.up = async (knex) => {
  await knex.schema.createTable('Comments', (table) => {
    table.integer('comment_id').unique().notNullable();
    table.string('student_name').notNullable();
    table.string('comment');
    table
      .integer('ann_id')
      .notNullable()
      .references('ann_id')
      .inTable('Announcements');

    table.primary('comment_id');
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTable('Comments');
};
