import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
	await knex.schema.createTable('images', (table) => {
		table.uuid('image_id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
		table.uuid('post_id').notNullable().references('post_id').inTable('posts');
		table.string('url', 255).notNullable();
		table.text('caption');
		table.timestamp('created_at').defaultTo(knex.fn.now());
	});
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTableIfExists('images');
}
