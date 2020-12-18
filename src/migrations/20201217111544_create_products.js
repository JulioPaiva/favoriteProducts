exports.up = knex => knex.schema.createTable('products', (t) => {
  t.increments('id').primary();
  t.string('product_id')
  t.integer('user_id')
    .references('id')
    .inTable('users').notNull();
});

exports.down = knex => knex.schema.dropTable('products');
