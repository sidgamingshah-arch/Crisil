exports.up = (knex) =>
  knex.schema.createTable('activity_participants', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.uuid('booking_id').notNullable().references('id').inTable('activity_bookings').onDelete('CASCADE');
    t.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    t.enu('payment_status', ['pending', 'paid', 'refunded']).defaultTo('pending');
    t.decimal('amount_paid', 10, 2);
    t.timestamp('joined_at').defaultTo(knex.fn.now());
    t.unique(['booking_id', 'user_id']);
  });

exports.down = (knex) => knex.schema.dropTableIfExists('activity_participants');
