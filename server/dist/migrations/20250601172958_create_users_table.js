export async function up(knex) {
    await knex.schema.createTable("users", (table) => {
        table.bigIncrements('user_id').primary();
        table.string('username', 50).unique();
        table.string('email', 255).notNullable().unique();
        table.string('password_hash', 255).notNullable();
        table.string('first_name', 50);
        table.string('last_name', 50);
        table.integer('age');
        table.enu('role', ['traveler', 'explorer', 'admin']).notNullable().defaultTo('explorer');
        table.string('profile_picture', 255);
        table.text('bio');
        table.timestamp('last_login');
        table.boolean('is_active').notNullable().defaultTo(true);
        table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
        table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
    });
}
export async function down(knex) {
    await knex.schema.dropTable("users");
}
//# sourceMappingURL=20250601172958_create_users_table.js.map