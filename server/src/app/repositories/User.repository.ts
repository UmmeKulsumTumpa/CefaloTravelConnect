import type { Knex } from "knex";
import type { User, IUserRepository } from "../interfaces/IUserRepository.js";
import { ROLES } from "../constants/User.constant.js";

export class UserRepository implements IUserRepository {
    constructor(private knex: Knex) {};

    async create(user: {
        email: string;
        password_hash: string;
        role?: string;
    }): Promise<number> {
        const [id] = await this.knex('users').insert({
            email: user.email,
            password_hash: user.password_hash,
            role: user.role,
            username: user.email.split('@')[0],
        }).returning('user_id');

        return id.user_id;
    };

    async findUsers(filters: {
        id?: number;
        username?: string;
        email?: string;
        search?: string
    }): Promise<User[]> {
        const query = this.knex('users');

        if(filters.id) query.where({user_id: filters.id});
        if(filters.username) query.whereILike('username', `%${filters.username}%`);
        if(filters.email) query.whereILike({email: filters.email});

        // search ta implement kora baki, otar logic pore likhbo

        return query;
    }
}
