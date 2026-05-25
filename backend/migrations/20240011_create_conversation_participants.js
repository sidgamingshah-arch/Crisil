exports.up = (knex) =>
  knex.schema.createTable('conversation_participants', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.uuid('conversation_id').notNullable().references('id').inTable('conversations').onDelete('CASCADE');
    t.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    t.timestamp('joined_at').defaultTo(knex.fn.now());
    t.timestamp('last_read_at').defaultTo(knex.fn.now());
    t.unique(['conversation_id', 'user_id']);
  });

exports.down = (knex) => knex.schema.dropTableIfExists('conversation_participants');
