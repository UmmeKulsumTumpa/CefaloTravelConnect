import { Knex } from 'knex';
import { CreatePostDto, UpdatePostDto, AddPostServiceDto, AddPostTransportDto, AddImageDto } from '../dtos/postDto.js';
import { Post, PostService, PostTransport, Image, IPostRepository, PostFilter, PostServiceFilter, ImageFilter, TransportFilter } from '../interfaces/post.interface.js';

export class PostRepository implements IPostRepository {
    constructor(private knex: Knex) { }

    async createPost(data: CreatePostDto): Promise<Post> {
        const [post] = await this.knex<Post>('posts').insert(data).returning('*');
        return post;
    }

    async updatePost(post_id: string, data: UpdatePostDto): Promise<Post> {
        const [post] = await this.knex<Post>('posts').where({ post_id }).update(data).returning('*');
        return post;
    }

    async getPostById(post_id: string): Promise<Post | undefined> {
        return this.knex<Post>('posts').where({ post_id }).first();
    }

    async getAllPosts(filters: PostFilter & { includePrivate?: boolean }): Promise<Post[]> {
        let query = this.knex<Post>('posts');

        if (filters.user_id) {
            query = query.where('user_id', filters.user_id);
        }
        if (filters.category) {
            query = query.whereRaw('categories @> ARRAY[?]::varchar[]', [filters.category]);
        }
        if (filters.title) {
            query = query.whereILike('title', `%${filters.title}%`);
        }
        // Visibility logic
        if (filters.user_id && filters.authUserId && filters.user_id === filters.authUserId && filters.includePrivate) {
            // Authenticated user requesting their own posts: all (public + private) posts
            // No additional visibility filter needed here
        } else if (filters.authUserId) {
            // Authenticated, but not requesting own posts: only public posts
            query = query.where('visibility', 'Public');
        } else {
            // Not authenticated: only public posts
            query = query.where('visibility', 'Public');
        }
        return query.select('*');
    }

    async deletePost(post_id: string): Promise<number> {
        return this.knex<Post>('posts').where({ post_id }).del();
    }

    async addPostService(data: AddPostServiceDto): Promise<PostService> {
        const [ps] = await this.knex<PostService>('post_services').insert(data).returning('*');
        return ps;
    }

    async addPostTransport(data: AddPostTransportDto): Promise<PostTransport> {
        const [pt] = await this.knex<PostTransport>('post_transports').insert(data).returning('*');
        return pt;
    }

    async addImage(data: AddImageDto): Promise<Image> {
        const [img] = await this.knex<Image>('images').insert(data).returning('*');
        return img;
    }

    async getPostServices(post_id: string, filters?: PostServiceFilter): Promise<PostService[]> {
        let query = this.knex<PostService>('post_services').where({ post_id });
        if (filters) {
            if (filters.costMin !== undefined) query = query.andWhere('cost', '>=', filters.costMin);
            if (filters.costMax !== undefined) query = query.andWhere('cost', '<=', filters.costMax);
            if (filters.ratingMin !== undefined) query = query.andWhere('rating', '>=', filters.ratingMin);
            if (filters.ratingMax !== undefined) query = query.andWhere('rating', '<=', filters.ratingMax);
            if (filters.recommended !== undefined) query = query.andWhere('recommended', filters.recommended);
            if (filters.service_id) query = query.andWhere('service_id', filters.service_id);
        }
        return query.select('*');
    }

    async getPostImages(post_id: string, filters?: ImageFilter): Promise<Image[]> {
        let query = this.knex<Image>('images').where({ post_id });
        if (filters) {
            if (filters.caption) query = query.andWhere('caption', 'ilike', `%${filters.caption}%`);
        }
        return query.select('*');
    }

    async getPostTransports(post_id: string, filters?: TransportFilter): Promise<PostTransport[]> {
        let query = this.knex<PostTransport>('post_transports').where({ post_id });
        if (filters) {
            if (filters.mode) query = query.andWhere('mode', filters.mode);
            if (filters.costMin !== undefined) query = query.andWhere('cost', '>=', filters.costMin);
            if (filters.costMax !== undefined) query = query.andWhere('cost', '<=', filters.costMax);
            if (filters.ratingMin !== undefined) query = query.andWhere('rating', '>=', filters.ratingMin);
            if (filters.ratingMax !== undefined) query = query.andWhere('rating', '<=', filters.ratingMax);
            if (filters.recommended !== undefined) query = query.andWhere('recommended', filters.recommended);
        }
        return query.select('*');
    }

    async likePost(post_id: string): Promise<Post> {
        const [post] = await this.knex<Post>('posts')
            .where({ post_id })
            .increment('likes', 1)
            .returning('*');
        return post;
    }

    async deletePostService(post_service_id: string): Promise<number> {
        return this.knex('post_services').where({ post_service_id }).del();
    }
    async deleteImage(image_id: string): Promise<number> {
        return this.knex('images').where({ image_id }).del();
    }
}
