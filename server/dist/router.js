import express from 'express';
import { UserRouter } from './app/routes/User.router.js';
const router = express.Router();
const moduleRoutes = [
    {
        path: '/users',
        route: UserRouter,
    },
];
moduleRoutes.forEach((route) => {
    router.use(route.path, route.route);
});
export default router;
//# sourceMappingURL=router.js.map