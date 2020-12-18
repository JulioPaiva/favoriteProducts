exports.up = knex => knex.schema.createTable('products', (t) => {
  t.increments('id').primary();
  t.string('product_id')
  t.integer('list_id')
    .references('id')
    .inTable('lists').notNull();
  t.datetime('date').notNull();
});

exports.down = knex => knex.schema.dropTable('products');
