exports.up = (knex) =>
  knex.schema.createTable('transport_matches', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.uuid('request_id').notNullable().references('id').inTable('transport_requests').onDelete('CASCADE');
    t.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    t.integer('seats_reserved').notNullable().defaultTo(1);
    t.enu('status', ['pending', 'confirmed', 'cancelled']).defaultTo('confirmed');
    t.timestamp('joined_at').defaultTo(knex.fn.now());
    t.unique(['request_id', 'user_id']);
  });

exports.down = (knex) => knex.schema.dropTableIfExists('transport_matches');
