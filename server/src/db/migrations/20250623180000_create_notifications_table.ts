import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('notifications', (table) => {
        table.uuid('notification_id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
        table.bigint('user_id').notNullable().references('user_id').inTable('users').onDelete('CASCADE');
        table.string('message').notNullable();
        table.string('type').notNullable().defaultTo('reminder');
        table.jsonb('data').nullable();
        table.boolean('read').notNullable().defaultTo(false);
        table.timestamp('created_at').defaultTo(knex.fn.now());
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('notifications');
}
