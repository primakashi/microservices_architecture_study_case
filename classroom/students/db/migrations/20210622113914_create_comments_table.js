exports.up = async (knex) => {
  await knex.schema.createTable('Comments', (table) => {
    table.increments('comment_id');
    table.integer('student_id').notNullable();
    table.string('comment');
    table
      .integer('ann_id')
      .notNullable()
      .references('ann_id')
      .inTable('Announcements');
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTable('Comments');
};
