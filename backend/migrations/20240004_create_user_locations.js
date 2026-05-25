exports.up = async (knex) => {
  await knex.schema.createTable('user_locations', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    t.uuid('destination_id').references('id').inTable('destinations');
    t.boolean('is_location_sharing').defaultTo(false);
    t.timestamp('updated_at').defaultTo(knex.fn.now());
  });
  await knex.raw(`
    ALTER TABLE user_locations
    ADD COLUMN location GEOGRAPHY(POINT, 4326)
  `);
};

exports.down = (knex) => knex.schema.dropTableIfExists('user_locations');
