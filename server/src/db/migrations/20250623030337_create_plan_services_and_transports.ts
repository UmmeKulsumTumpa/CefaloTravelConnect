import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable('plan_services', (table) => {
		table.uuid('plan_service_id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
		table.uuid('plan_id').notNullable().references('plan_id').inTable('travel_plans');
		table.uuid('service_id').notNullable().references('service_id').inTable('services');
		table.decimal('estimated_cost', 10, 2);
		table.date('planned_visit_date');
		table.text('notes');
		table.boolean('notify_when_near').defaultTo(false);
		table.timestamp('created_at').defaultTo(knex.fn.now());
	});

	await knex.schema.createTable('plan_transports', (table) => {
		table.uuid('plan_transport_id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
		table.uuid('plan_id').notNullable().references('plan_id').inTable('travel_plans');
		table.uuid('service_id').notNullable().references('service_id').inTable('services');
		table.decimal('estimated_cost', 10, 2);
		table.timestamp('planned_departure_time');
		table.timestamp('planned_arrival_time');
		table.decimal('start_point_latitude', 10, 6);
		table.decimal('start_point_longitude', 10, 6);
		table.text('start_point_address');
		table.decimal('end_point_latitude', 10, 6);
		table.decimal('end_point_longitude', 10, 6);
		table.text('end_point_address');
		table.text('notes');
		table.boolean('notify_when_near').defaultTo(false);
		table.timestamp('created_at').defaultTo(knex.fn.now());
	});
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTableIfExists('plan_transports');
	await knex.schema.dropTableIfExists('plan_services');
}