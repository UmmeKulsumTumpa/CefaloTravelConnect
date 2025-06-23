import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('travel_plans', (table) => {
        table.uuid('plan_id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
        table.string('name', 255).notNullable();
        table.date('start_date');
        table.date('end_date');
        table.decimal('total_cost', 10, 2);
        table.integer('total_duration');
        table.integer('upvotes').defaultTo(0);
        table.integer('downvotes').defaultTo(0);
        table.timestamp('created_at').defaultTo(knex.fn.now());
    });

    await knex.schema.createTable('plan_comments', (table) => {
        table.uuid('comment_id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
        table.uuid('plan_id').notNullable().references('plan_id').inTable('travel_plans');
        table.bigint('user_id').notNullable().references('user_id').inTable('users');
        // for reply to comments, but will not be implemented in this iteration
        // table.uuid('parent_comment_id').references('comment_id').inTable('plan_comments');
        table.text('content').notNullable();
        table.timestamp('posted_at').defaultTo(knex.fn.now());
    });

    await knex.schema.createTable('plan_participants', (table) => {
        table.uuid('plan_id').references('plan_id').inTable('travel_plans');
        table.bigint('user_id').references('user_id').inTable('users');
        table.boolean('is_going').defaultTo(false);
        table.enu('role_permission', ['Owner', 'Editor', 'Viewer']).defaultTo('Editor');
        table.primary(['plan_id', 'user_id']);
    });

    await knex.schema.createTable('planned_places', (table) => {
        table.uuid('plan_id').references('plan_id').inTable('travel_plans');
        table.uuid('place_id').references('place_id').inTable('places');
        table.enu('priority', ['MustVisit', 'Optional', 'Recommended', 'Avoid']).defaultTo('Recommended');
        table.primary(['plan_id', 'place_id']);
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('planned_places');
    await knex.schema.dropTableIfExists('plan_participants');
    await knex.schema.dropTableIfExists('plan_comments');
    await knex.schema.dropTableIfExists('travel_plans');
}