import express from 'express';
import helmet from 'helmet';
import { errorHandler } from './middlewares/errorHandler';
import { notFoundHandler } from './middlewares/notFoundHandler';
import authRoute from './routes/authRoute';
import doctorRoute from './routes/doctorRoute';
import checkRoleHandler from './middlewares/checkRoleHandler';
import { authenticateHandler } from './middlewares/authenticateHandler';

const app = express();

app.use(helmet());
app.use(express.json());

app.use('/api/auth', authRoute);
app.use(
  '/api/doctors',
  authenticateHandler,
  checkRoleHandler(['ADMIN']),
  doctorRoute,
);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
