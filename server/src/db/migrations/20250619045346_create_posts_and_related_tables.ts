import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {

	await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

	// geolocations
	await knex.schema.createTable('geolocations', (table) => {
		table.uuid('geolocation_id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
		table.decimal('latitude', 10, 6).notNullable();
		table.decimal('longitude', 10, 6).notNullable();
		table.text('address');
		table.timestamp('created_at').defaultTo(knex.fn.now());
	});

	// destinations
	await knex.schema.createTable('destinations', (table) => {
		table.uuid('destination_id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
		// table.uuid('wishlist_id').notNullable();
		table.string('name', 255).notNullable();
		table.uuid('geolocation_id');
		table.text('notes');
		table.enu('status', ['Planned', 'Visited', 'Skipped'], { useNative: true, enumName: 'DestStatus' }).defaultTo('Planned');
		table.timestamp('created_at').defaultTo(knex.fn.now());

		// table.foreign('wishlist_id').references('wishlist_id').inTable('wishlists');
		table.foreign('geolocation_id').references('geolocation_id').inTable('geolocations');
	});

	// posts
	await knex.schema.createTable('posts', (table) => {
		table.uuid('post_id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
		table.bigint('user_id').notNullable().references('user_id').inTable('users').onDelete('CASCADE');
		table.string('title', 255).notNullable();
		table.decimal('total_cost', 10, 2);
		table.integer('total_duration');
		table.enu('effort_level', ['Low', 'Medium', 'High']);
		table.uuid('destination_id').references('destination_id').inTable('destinations');
		table.string('categories', 255);
		table.enu('visibility', ['Public', 'Private', 'Friends']).defaultTo('Public');
		table.timestamp('created_at').defaultTo(knex.fn.now());
	});

	// images
	await knex.schema.createTable('images', (table) => {
		table.uuid('image_id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
		table.uuid('post_id').notNullable().references('post_id').inTable('posts').onDelete('CASCADE');
		table.string('url', 255).notNullable();
		table.text('caption');
		table.timestamp('created_at').defaultTo(knex.fn.now());
	});

	// services
	await knex.schema.createTable('services', (table) => {
		table.uuid('service_id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
		table.string('name', 255).notNullable();
		table.enu('type', ['Hotel', 'Restaurant', 'Attraction']).notNullable();
		table.uuid('geolocation_id').references('geolocation_id').inTable('geolocations');
		table.text('description');
		table.timestamp('created_at').defaultTo(knex.fn.now());
	});

	// transports
	await knex.schema.createTable('transports', (table) => {
		table.uuid('transport_id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
		table.string('name', 255).notNullable();
		table.enu('mode', ['Flight', 'Car', 'Rental', 'Bus', 'Train', 'Boat']).notNullable();
		table.uuid('geolocation_from_id').references('geolocation_id').inTable('geolocations');
		table.uuid('geolocation_to_id').references('geolocation_id').inTable('geolocations');
		table.string('operator', 100);
		table.text('description');
		table.timestamp('created_at').defaultTo(knex.fn.now());
	});

	// post_services (composite PK)
	await knex.schema.createTable('post_services', (table) => {
		table.uuid('post_id').notNullable().references('post_id').inTable('posts').onDelete('CASCADE');
		table.uuid('service_id').notNullable().references('service_id').inTable('services').onDelete('CASCADE');
		table.decimal('cost', 10, 2);
		table.integer('rating');
		table.date('visit_date');
		table.text('notes');
		table.timestamp('created_at').defaultTo(knex.fn.now());
		table.primary(['post_id', 'service_id']);
	});

	// post_transports (composite PK)
	await knex.schema.createTable('post_transports', (table) => {
		table.uuid('post_id').notNullable().references('post_id').inTable('posts').onDelete('CASCADE');
		table.uuid('transport_id').notNullable().references('transport_id').inTable('transports').onDelete('CASCADE');
		table.decimal('cost', 10, 2);
		table.integer('rating');
		table.timestamp('departure_time');
		table.timestamp('arrival_time');
		table.text('notes');
		table.timestamp('created_at').defaultTo(knex.fn.now());
		table.primary(['post_id', 'transport_id']);
	});
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTableIfExists('post_transports');
	await knex.schema.dropTableIfExists('post_services');
	await knex.schema.dropTableIfExists('transports');
	await knex.schema.dropTableIfExists('services');
	await knex.schema.dropTableIfExists('images');
	await knex.schema.dropTableIfExists('posts');
	await knex.schema.dropTableIfExists('destinations');
	await knex.schema.dropTableIfExists('geolocations');
}
