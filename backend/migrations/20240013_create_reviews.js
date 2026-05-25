exports.up = (knex) =>
  knex.schema.createTable('reviews', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.uuid('reviewer_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    t.uuid('reviewee_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    t.integer('rating').notNullable().checkBetween([1, 5]);
    t.text('comment');
    t.enu('trip_context', ['transport', 'activity']).notNullable();
    t.uuid('transport_request_id').references('id').inTable('transport_requests').onDelete('SET NULL');
    t.uuid('activity_booking_id').references('id').inTable('activity_bookings').onDelete('SET NULL');
    t.timestamp('created_at').defaultTo(knex.fn.now());
    t.unique(['reviewer_id', 'reviewee_id', 'transport_request_id']);
    t.unique(['reviewer_id', 'reviewee_id', 'activity_booking_id']);
  });

exports.down = (knex) => knex.schema.dropTableIfExists('reviews');
