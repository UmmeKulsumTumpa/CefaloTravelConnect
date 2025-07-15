import express from 'express';
import { UserRouter } from './app/routes/user.router.js';
import PlaceRouter from './app/routes/place.router.js';
import WishlistRouter from './app/routes/wishlist.router.js';
import ServiceRouter from './app/routes/service.router.js';
import PostRouter from './app/routes/post.router.js';
import TravelPlanRouter from './app/routes/travelplan.router.js';
import NotificationRouter from './app/routes/notification.router.js';

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
    },
    {
        path: '/notifications',
        route: NotificationRouter,
    }
];

moduleRoutes.forEach((route) => {
    router.use(route.path, route.route);
}
);

export default router;
