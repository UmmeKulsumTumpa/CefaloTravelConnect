import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
	await knex.schema.createTable('post_services', (table) => {
		table.uuid('post_service_id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
		table.uuid('post_id').notNullable().references('post_id').inTable('posts');
		table.uuid('service_id').notNullable().references('service_id').inTable('services');
		table.decimal('cost', 10, 2);
		table.float('rating');
		table.date('visit_date');
		table.text('notes');
		table.boolean('recommended').defaultTo(true);
		table.timestamp('created_at').defaultTo(knex.fn.now());
	});
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTableIfExists('post_services');
}
