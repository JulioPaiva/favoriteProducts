exports.up = knex => knex.schema.createTable('lists', (t) => {
  t.increments('id').primary();
  t.integer('user_id')
    .references('id')
    .inTable('users').notNull();
  t.datetime('date').notNull();
});

exports.down = knex => knex.schema.dropTable('lists');
