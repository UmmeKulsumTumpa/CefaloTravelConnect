import express, {Application, Request, Response} from 'express';
import cors from 'cors';
import router from './app/routes/router.js';

const app: Application = express();

app.use(cors());

// application routes
app.use('/api/v1', router);

app.use("/", async (req: Request, res: Response) => {
  res.send("app is running successfully");
});

export default app;

