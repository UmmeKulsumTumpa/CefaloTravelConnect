import express from 'express';
import { UserRouter } from './app/routes/User.router.js';
import { PostRouter } from './app/routes/Post.router.js';
import { GeolocationRouter } from './app/routes/Geolocation.router.js';

const router = express.Router();

const moduleRoutes = [
    {
        path: '/users',
        route: UserRouter,
    },
    {
        path: '/posts',
        route: PostRouter,
    },
    {
        path: '/geolocations',
        route: GeolocationRouter,
    }
];

moduleRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

export default router;
