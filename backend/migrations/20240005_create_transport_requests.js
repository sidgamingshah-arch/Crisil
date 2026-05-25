exports.up = async (knex) => {
  await knex.schema.createTable('transport_requests', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    t.uuid('destination_id').notNullable().references('id').inTable('destinations');
    t.timestamp('departure_time').notNullable();
    t.integer('seats_available').notNullable().defaultTo(1);
    t.integer('seats_total').notNullable().defaultTo(1);
    t.enu('transport_type', ['taxi', 'rideshare', 'minivan', 'bus', 'boat', 'other']).defaultTo('rideshare');
    t.decimal('price_per_person', 10, 2);
    t.string('currency_code', 3).defaultTo('USD');
    t.enu('status', ['open', 'full', 'departed', 'cancelled']).defaultTo('open');
    t.text('notes');
    t.timestamps(true, true);
  });
  await knex.raw(`
    ALTER TABLE transport_requests
    ADD COLUMN pickup_location GEOGRAPHY(POINT, 4326)
  `);
};

exports.down = (knex) => knex.schema.dropTableIfExists('transport_requests');
