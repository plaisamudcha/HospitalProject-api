import { Router } from 'express';
import {
  validateSignIn,
  validateSignUpDoctor,
  validateSignUpPatient,
} from '../validators/authValidator';
import { authenticateHandler } from '../middlewares/authenticateHandler';
import authController from '../controllers/authController';

const authRoute = Router();

authRoute.post(
  '/signup/patient',
  validateSignUpPatient,
  authController.signUpPatient,
);
authRoute.post('/signup/doctor', validateSignUpDoctor, () => {});
authRoute.post('/signin', validateSignIn, () => {});
authRoute.get('/me', authenticateHandler, () => {});

export default authRoute;
