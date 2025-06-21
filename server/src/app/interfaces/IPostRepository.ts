import { CreatePostDto, UpdatePostDto, AddPostServiceDto, AddPostTransportDto, AddImageDto } from '../dtos/PostDto.js';
import { POST_EFFORT_LEVELS, EffortLevel, POST_VISIBILITY, Visibility } from '../constants/Post.constant.js';

export interface Post {
    post_id: string;
    user_id: string;
    title: string;
    description?: string;
    total_cost?: number;
    total_duration?: number;
    effort_level?: EffortLevel;
    place_id?: string;
    categories?: string[];
    visibility: Visibility;
    likes: number;
    created_at: string;
}

export interface PostService {
    post_service_id: string;
    post_id: string;
    service_id: string;
    cost?: number;
    rating?: number;
    visit_date?: string;
    notes?: string;
    recommended?: boolean;
    created_at: string;
}

export interface PostTransport {
    post_transport_id: string;
    post_id: string;
    service_id: string;
    cost?: number;
    rating?: number;
    departure_time?: string;
    arrival_time?: string;
    latitude_from: number;
    longitude_from: number;
    address_from?: string;
    latitude_to: number;
    longitude_to: number;
    address_to?: string;
    notes?: string;
    recommended?: boolean;
    created_at: string;
}

export interface Image {
    image_id: string;
    post_id: string;
    url: string;
    caption?: string;
    created_at: string;
}

export type PostFilter = {
    user_id?: string;
    category?: string;
    title?: string;
    visibility?: Visibility;
    authUserId?: string;
};

export interface IPostRepository {
    createPost(data: CreatePostDto): Promise<Post>;
    updatePost(post_id: string, data: UpdatePostDto): Promise<Post>;
    getPostById(post_id: string): Promise<Post | undefined>;
    getAllPosts(filters: PostFilter): Promise<Post[]>;
    deletePost(post_id: string): Promise<number>;
    addPostService(data: AddPostServiceDto): Promise<PostService>;
    addPostTransport(data: AddPostTransportDto): Promise<PostTransport>;
    addImage(data: AddImageDto): Promise<Image>;
    getPostServices(post_id: string): Promise<PostService[]>;
    getPostTransports(post_id: string): Promise<PostTransport[]>;
    getPostImages(post_id: string): Promise<Image[]>;
    likePost(post_id: string): Promise<Post>;
}
