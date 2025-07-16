import express from 'express';
import {
    UserRouter,
    PlaceRouter,
    WishlistRouter,
    ServiceRouter,
    PostRouter,
    TravelPlanRouter,
    NotificationRouter
} from './app/routes/index.js';

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
