exports.up = (knex) =>
  knex.schema.createTable('conversations', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.enu('type', ['direct', 'transport_group', 'activity_group']).defaultTo('direct');
    t.string('title');
    t.uuid('transport_request_id').references('id').inTable('transport_requests').onDelete('SET NULL');
    t.uuid('activity_booking_id').references('id').inTable('activity_bookings').onDelete('SET NULL');
    t.timestamps(true, true);
  });

exports.down = (knex) => knex.schema.dropTableIfExists('conversations');
