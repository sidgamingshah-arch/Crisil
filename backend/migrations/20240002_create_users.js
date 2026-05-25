exports.up = (knex) =>
  knex.schema.createTable('users', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.string('firebase_uid').notNullable().unique();
    t.string('name').notNullable();
    t.string('email').notNullable().unique();
    t.string('avatar_url');
    t.text('bio');
    t.specificType('languages', 'text[]').defaultTo('{}');
    t.string('nationality');
    t.string('phone');
    t.decimal('rating', 3, 2).defaultTo(0.0);
    t.integer('total_reviews').defaultTo(0);
    t.boolean('is_verified').defaultTo(false);
    t.string('fcm_token');
    t.string('preferred_language').defaultTo('en');
    t.timestamps(true, true);
  });

exports.down = (knex) => knex.schema.dropTableIfExists('users');
