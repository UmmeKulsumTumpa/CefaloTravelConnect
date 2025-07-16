import type { Knex } from "knex";
import type { User, UserFilter, IUserRepository } from "../interfaces/index.js";
import { ROLES } from "../constants/user.constant.js";

export class UserRepository implements IUserRepository {
    constructor(private knex: Knex) {};

    async create(user: {
        email: string;
        password_hash: string;
    }): Promise<number> {
        const [id] = await this.knex('users').insert({
            email: user.email,
            password_hash: user.password_hash,
            username: user.email.split('@')[0],
            is_active: true,
            created_at: this.knex.fn.now(),
            updated_at: this.knex.fn.now(),
        }).returning('user_id');

        return id.user_id;
    };

    async findUsers(filters: UserFilter): Promise<User[]> {
        let query = this.knex('users');

        if(filters.id) query = query.where('user_id', filters.id);
        if(filters.username) query = query.where('username', filters.username);
        if(filters.email) query = query.where('email', filters.email);
        if(filters.search) {
            query = query
                        .where('username', 'like', `%${filters.search}%`)
                        .orWhere('email', 'like', `%${filters.search}%`)
                        .orWhere('first_name', 'like', `%${filters.search}%`)
                        .orWhere('last_name', 'like', `%${filters.search}%`);
        }

        return query.select();
    };

    async findById(id: number): Promise<User | undefined> {
        return this.knex('users')
            .where('user_id', id)
            .first();
    };

    async update(id: number, user: Partial<User>): Promise<boolean> {
        const result = await this.knex('users')
            .where('user_id', id)
            .update({
                ...user,
                updated_at: this.knex.fn.now(),
            });

        return result > 0;
    };

    async delete(id: number): Promise<boolean> {
        const result = await this.knex('users')
            .where('user_id', id)
            .update({ is_active: false});

        return result > 0;
    };

    async saveRefreshToken(userId: number, token: string, expiresAt: Date): Promise<void> {
        await this.knex('refresh_tokens').insert({
            user_id: userId,
            token,
            expires_at: expiresAt,
        });
    }

    async deleteRefreshToken(token: string): Promise<void> {
        await this.knex('refresh_tokens').where({ token }).del();
    }

    async findRefreshToken(token: string): Promise<{ id: number, user_id: number, token: string, expires_at: Date } | undefined> {
        return this.knex('refresh_tokens').where({ token }).first();
    }

    async deleteAllRefreshTokensForUser(userId: number): Promise<void> {
        await this.knex('refresh_tokens').where({ user_id: userId }).del();
    }
}
