export class UserRepository {
    constructor(knex) {
        this.knex = knex;
    }
    ;
    async create(user) {
        const [id] = await this.knex('users').insert({
            email: user.email,
            password_hash: user.password_hash,
            username: user.email.split('@')[0],
            is_active: true,
            created_at: this.knex.fn.now(),
            updated_at: this.knex.fn.now(),
        }).returning('user_id');
        return id.user_id;
    }
    ;
    async findUsers(filters) {
        let query = this.knex('users');
        if (filters.id)
            query = query.where('user_id', filters.id);
        if (filters.username)
            query = query.where('username', filters.username);
        if (filters.email)
            query = query.where('email', filters.email);
        if (filters.search) {
            query = query
                .where('username', 'like', `%${filters.search}%`)
                .orWhere('email', 'like', `%${filters.search}%`)
                .orWhere('first_name', 'like', `%${filters.search}%`)
                .orWhere('last_name', 'like', `%${filters.search}%`);
        }
        return query.select();
    }
    ;
    async findById(id) {
        return this.knex('users')
            .where('user_id', id)
            .first();
    }
    ;
    async update(id, user) {
        const result = await this.knex('users')
            .where('user_id', id)
            .update({
            ...user,
            updated_at: this.knex.fn.now(),
        });
        return result > 0;
    }
    ;
    async delete(id) {
        const result = await this.knex('users')
            .where('user_id', id)
            .update({ is_active: false });
        return result > 0;
    }
    ;
}
//# sourceMappingURL=User.repository.js.map