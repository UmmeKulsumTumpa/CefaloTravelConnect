import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable('post_transports', (table) => {
		table.uuid('post_transport_id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
		table.uuid('post_id').notNullable().references('post_id').inTable('posts');
		table.uuid('service_id').notNullable().references('service_id').inTable('services');
		table.decimal('cost', 10, 2);
		table.float('rating');
		table.timestamp('departure_time');
		table.timestamp('arrival_time');
		table.decimal('start_point_latitude', 10, 6);
		table.decimal('start_point_longitude', 10, 6);
		table.text('start_point_address');
		table.decimal('end_point_latitude', 10, 6);
		table.decimal('end_point_longitude', 10, 6);
		table.text('end_point_address');
		table.text('address_to');
		table.text('notes');
		table.timestamp('created_at').defaultTo(knex.fn.now());
	});
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTableIfExists('post_transports');
}
