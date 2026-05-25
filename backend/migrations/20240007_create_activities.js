exports.up = (knex) =>
  knex.schema.createTable('activities', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.uuid('destination_id').notNullable().references('id').inTable('destinations');
    t.string('name').notNullable();
    t.text('description');
    t.enu('category', [
      'tour', 'adventure', 'cultural', 'food', 'nightlife',
      'sports', 'wellness', 'workshop', 'cruise', 'other'
    ]).defaultTo('tour');
    t.decimal('base_price', 10, 2).notNullable();
    t.string('currency_code', 3).defaultTo('USD');
    t.integer('min_group_size').defaultTo(1);
    t.integer('max_group_size').notNullable();
    t.integer('duration_minutes');
    t.string('image_url');
    t.json('discount_tiers').defaultTo('[]');
    t.boolean('is_active').defaultTo(true);
    t.timestamps(true, true);
  });

exports.down = (knex) => knex.schema.dropTableIfExists('activities');
