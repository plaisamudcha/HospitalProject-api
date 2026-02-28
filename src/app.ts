import { Request, Response } from 'express';
import express from 'express';
import { errorHandler } from './middlewares/errorHandler';
import { notFoundHandler } from './middlewares/notFoundHandler';
import authRoute from './routes/authRoute';

const app = express();

app.use(express.json());

app.use('/', (req: Request, res: Response) => {
  res.send('Hello, World!');
});
app.use('/api/auth', authRoute);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
