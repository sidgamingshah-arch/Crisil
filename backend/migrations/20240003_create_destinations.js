exports.up = async (knex) => {
  await knex.schema.createTable('destinations', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.string('name').notNullable();
    t.string('city').notNullable();
    t.string('country').notNullable();
    t.string('country_code', 2).notNullable();
    t.text('description');
    t.string('image_url');
    t.string('timezone');
    t.string('currency_code', 3);
    t.timestamps(true, true);
  });
  await knex.raw(`
    ALTER TABLE destinations
    ADD COLUMN location GEOGRAPHY(POINT, 4326)
  `);
};

exports.down = (knex) => knex.schema.dropTableIfExists('destinations');
