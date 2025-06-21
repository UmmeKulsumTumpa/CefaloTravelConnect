import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('places', (table) => {
        table.uuid('place_id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
        table.string('name', 255).notNullable();
        table.decimal('latitude', 10, 6).notNullable();
        table.decimal('longitude', 10, 6).notNullable();
        table.text('address');
        table.text('notes');
        table.timestamp('created_at').defaultTo(knex.fn.now());
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('places');
}
