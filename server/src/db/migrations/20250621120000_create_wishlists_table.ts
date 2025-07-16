import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
    await knex.schema.createTable('wishlists', (table) => {
        table.uuid('wishlist_id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
        table.uuid('place_id').notNullable().references('place_id').inTable('places').onDelete('CASCADE');
        table.bigint('user_id').notNullable().references('user_id').inTable('users').onDelete('CASCADE');
        table.string('name', 255).notNullable();
        table.string('region', 100);
        table.string('theme', 100);
        table.boolean('is_public').defaultTo(true);
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.unique(['place_id', 'user_id']);
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('wishlists');
}
