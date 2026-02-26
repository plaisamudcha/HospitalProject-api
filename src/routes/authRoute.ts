import { Router } from 'express';
import { validateSignIn, validateSignUp } from '../validators/authValidator';
import { authenticateHandler } from '../middlewares/authenticateHandler';

const authRoute = Router();

authRoute.post('/signup', validateSignUp, () => {});
authRoute.post('/login', validateSignIn, () => {});
authRoute.get('/me', authenticateHandler, () => {});

export default authRoute;
