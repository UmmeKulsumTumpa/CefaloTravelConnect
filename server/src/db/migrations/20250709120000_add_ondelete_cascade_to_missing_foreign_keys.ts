import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable('posts', (table) => {
        table.dropForeign(['user_id']);
        table.foreign('user_id').references('users.user_id').onDelete('CASCADE');
        table.dropForeign(['place_id']);
        table.foreign('place_id').references('places.place_id').onDelete('CASCADE');
    });

    await knex.schema.alterTable('post_services', (table) => {
        table.dropForeign(['post_id']);
        table.foreign('post_id').references('posts.post_id').onDelete('CASCADE');
        table.dropForeign(['service_id']);
        table.foreign('service_id').references('services.service_id').onDelete('CASCADE');
    });

    await knex.schema.alterTable('post_transports', (table) => {
        table.dropForeign(['post_id']);
        table.foreign('post_id').references('posts.post_id').onDelete('CASCADE');
        table.dropForeign(['service_id']);
        table.foreign('service_id').references('services.service_id').onDelete('CASCADE');
    });

    await knex.schema.alterTable('images', (table) => {
        table.dropForeign(['post_id']);
        table.foreign('post_id').references('posts.post_id').onDelete('CASCADE');
    });

    await knex.schema.alterTable('plan_comments', (table) => {
        table.dropForeign(['plan_id']);
        table.foreign('plan_id').references('travel_plans.plan_id').onDelete('CASCADE');
        table.dropForeign(['user_id']);
        table.foreign('user_id').references('users.user_id').onDelete('CASCADE');
    });

    await knex.schema.alterTable('plan_participants', (table) => {
        table.dropForeign(['plan_id']);
        table.foreign('plan_id').references('travel_plans.plan_id').onDelete('CASCADE');
        table.dropForeign(['user_id']);
        table.foreign('user_id').references('users.user_id').onDelete('CASCADE');
    });

    await knex.schema.alterTable('planned_places', (table) => {
        table.dropForeign(['plan_id']);
        table.foreign('plan_id').references('travel_plans.plan_id').onDelete('CASCADE');
        table.dropForeign(['place_id']);
        table.foreign('place_id').references('places.place_id').onDelete('CASCADE');
    });

    await knex.schema.alterTable('plan_services', (table) => {
        table.dropForeign(['plan_id']);
        table.foreign('plan_id').references('travel_plans.plan_id').onDelete('CASCADE');
        table.dropForeign(['service_id']);
        table.foreign('service_id').references('services.service_id').onDelete('CASCADE');
    });

    await knex.schema.alterTable('plan_transports', (table) => {
        table.dropForeign(['plan_id']);
        table.foreign('plan_id').references('travel_plans.plan_id').onDelete('CASCADE');
        table.dropForeign(['service_id']);
        table.foreign('service_id').references('services.service_id').onDelete('CASCADE');
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable('posts', (table) => {
        table.dropForeign(['user_id']);
        table.foreign('user_id').references('users.user_id');
        table.dropForeign(['place_id']);
        table.foreign('place_id').references('places.place_id');
    });

    await knex.schema.alterTable('post_services', (table) => {
        table.dropForeign(['post_id']);
        table.foreign('post_id').references('posts.post_id');
        table.dropForeign(['service_id']);
        table.foreign('service_id').references('services.service_id');
    });

    await knex.schema.alterTable('post_transports', (table) => {
        table.dropForeign(['post_id']);
        table.foreign('post_id').references('posts.post_id');
        table.dropForeign(['service_id']);
        table.foreign('service_id').references('services.service_id');
    });

    await knex.schema.alterTable('images', (table) => {
        table.dropForeign(['post_id']);
        table.foreign('post_id').references('posts.post_id');
    });

    await knex.schema.alterTable('plan_comments', (table) => {
        table.dropForeign(['plan_id']);
        table.foreign('plan_id').references('travel_plans.plan_id');
        table.dropForeign(['user_id']);
        table.foreign('user_id').references('users.user_id');
    });

    await knex.schema.alterTable('plan_participants', (table) => {
        table.dropForeign(['plan_id']);
        table.foreign('plan_id').references('travel_plans.plan_id');
        table.dropForeign(['user_id']);
        table.foreign('user_id').references('users.user_id');
    });

    await knex.schema.alterTable('planned_places', (table) => {
        table.dropForeign(['plan_id']);
        table.foreign('plan_id').references('travel_plans.plan_id');
        table.dropForeign(['place_id']);
        table.foreign('place_id').references('places.place_id');
    });

    await knex.schema.alterTable('plan_services', (table) => {
        table.dropForeign(['plan_id']);
        table.foreign('plan_id').references('travel_plans.plan_id');
        table.dropForeign(['service_id']);
        table.foreign('service_id').references('services.service_id');
    });

    await knex.schema.alterTable('plan_transports', (table) => {
        table.dropForeign(['plan_id']);
        table.foreign('plan_id').references('travel_plans.plan_id');
        table.dropForeign(['service_id']);
        table.foreign('service_id').references('services.service_id');
    });
}
