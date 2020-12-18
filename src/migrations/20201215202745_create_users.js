
exports.up = knex => knex.schema.createTable('users', (t) => {
  t.increments('id').primary();
  t.string('name', 100).notNull();
  t.string('mail', 100).notNull().unique();
});

exports.down = knex => knex.schema.dropTable('users');
