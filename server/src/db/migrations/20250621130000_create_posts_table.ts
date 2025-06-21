import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable('posts', (table) => {
		table.uuid('post_id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
		table.bigint('user_id').notNullable().references('user_id').inTable('users');
		table.string('title', 255).notNullable();
		table.decimal('total_cost', 10, 2);
		table.integer('total_duration');
		table.text('description');
		table.enu('effort_level', ['Low', 'Medium', 'High']);
		table.uuid('place_id').references('place_id').inTable('places');
		table.specificType('categories', 'varchar(255)[]');
		table.enu('visibility', ['Public', 'Private', 'Friends']).defaultTo('Public');
		table.integer('likes').defaultTo(0);
		table.timestamp('created_at').defaultTo(knex.fn.now());
	});
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTableIfExists('posts');
}
