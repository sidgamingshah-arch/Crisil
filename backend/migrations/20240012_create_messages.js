exports.up = (knex) =>
  knex.schema.createTable('messages', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.uuid('conversation_id').notNullable().references('id').inTable('conversations').onDelete('CASCADE');
    t.uuid('sender_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    t.text('content').notNullable();
    t.enu('type', ['text', 'image', 'location', 'system']).defaultTo('text');
    t.json('metadata');
    t.timestamp('created_at').defaultTo(knex.fn.now());
    t.timestamp('updated_at').defaultTo(knex.fn.now());
  });

exports.down = (knex) => knex.schema.dropTableIfExists('messages');
