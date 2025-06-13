import express from 'express';
import cors from 'cors';
import router from './router.js';
const app = express();
app.use(cors());
app.use(express.json());
// application routes
app.use('/api/v1', router);
export default app;
//# sourceMappingURL=app.js.map