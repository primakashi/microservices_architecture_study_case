exports.up = async (knex) => {
  await knex.schema.table('Comments', (table) => {
    table.string('student_name');
  });
};

exports.down = async (knex) => {
  await knex.schema.table('Comments', (table) => {
    table.dropColumn('student_name');
  });
};
