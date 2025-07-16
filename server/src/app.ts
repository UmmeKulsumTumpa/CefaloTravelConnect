import express, {Application, Request, Response} from 'express';
import cors from 'cors';
import router from './router.js';
import { errorHandler } from './app/middlewares/error.middleware.js';

const app: Application = express();

app.use(cors());
app.use(express.json());

// application routes
app.use('/api/v1', router);

app.use(errorHandler);

export default app;

