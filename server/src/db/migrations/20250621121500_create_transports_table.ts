import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable('transports', (table) => {
		table.uuid('service_id').primary();
		table.enu('mode', ['Flight', 'Car', 'Rental', 'Bus', 'Train', 'Boat']).notNullable();
		table.string('operator', 100);
		table.timestamp('created_at').defaultTo(knex.fn.now());
		table.foreign('service_id').references('service_id').inTable('services').onDelete('CASCADE');
	});
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTableIfExists('transports');
}
