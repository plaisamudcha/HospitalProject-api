import express from 'express';
import { errorHandler } from './middlewares/errorHandler';
import { notFoundHandler } from './middlewares/notFoundHandler';
import authRoute from './routes/authRoute';
import doctorRoute from './routes/doctorRoute';
import checkRoleHandler from './middlewares/checkRoleHandler';
import { authenticateHandler } from './middlewares/authenticateHandler';

const app = express();

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
