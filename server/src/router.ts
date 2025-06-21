import express from 'express';
import { UserRouter } from './app/routes/User.router.js';
import PlaceRouter from './app/routes/Place.router.js';
import WishlistRouter from './app/routes/Wishlist.router.js';

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
];

moduleRoutes.forEach((route) => {
    router.use(route.path, route.route);
}
);

export default router;
