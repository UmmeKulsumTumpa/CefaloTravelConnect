import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable('services', (table) => {
		table.uuid('service_id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
		table.string('name', 255).notNullable();
		table.enu('type', ['Hotel', 'Restaurant', 'Attraction', 'Transport']).notNullable();
		table.decimal('latitude', 10, 6);
		table.decimal('longitude', 10, 6);
		table.text('address');
		table.text('description');
		table.timestamp('created_at').defaultTo(knex.fn.now());
	});
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTableIfExists('services');
}
