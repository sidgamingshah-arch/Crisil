exports.up = (knex) =>
  knex.schema.createTable('activity_bookings', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.uuid('activity_id').notNullable().references('id').inTable('activities').onDelete('CASCADE');
    t.uuid('organizer_user_id').notNullable().references('id').inTable('users');
    t.timestamp('scheduled_at').notNullable();
    t.integer('current_participants').defaultTo(1);
    t.enu('status', ['forming', 'confirmed', 'completed', 'cancelled']).defaultTo('forming');
    t.text('notes');
    t.timestamps(true, true);
  });

exports.down = (knex) => knex.schema.dropTableIfExists('activity_bookings');
