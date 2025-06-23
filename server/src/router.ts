import express from 'express';
import { UserRouter } from './app/routes/User.router.js';
import PlaceRouter from './app/routes/Place.router.js';
import WishlistRouter from './app/routes/Wishlist.router.js';
import ServiceRouter from './app/routes/Service.router.js';
import PostRouter from './app/routes/Post.router.js';
import TravelPlanRouter from './app/routes/TravelPlan.router.js';
import path from 'path';

const router = express.Router();

const moduleRoutes = [
    {
        path: '/users',
        route: UserRouter,
    },
    {
        path: '/places',
        route: PlaceRouter,
    },
    {
        path: '/wishlists',
        route: WishlistRouter,
    },
    {
        path: '/services',
        route: ServiceRouter,
    },
    {
        path: '/posts',
        route: PostRouter,
    },
    {
        path: '/travel-plans',
        route: TravelPlanRouter,
    }
];

moduleRoutes.forEach((route) => {
    router.use(route.path, route.route);
}
);

export default router;
