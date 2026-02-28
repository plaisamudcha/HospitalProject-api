import { Router } from 'express';
import {
  validateSignIn,
  validateSignUpDoctor,
  validateSignUpPatient,
} from '../validators/authValidator';
import { authenticateHandler } from '../middlewares/authenticateHandler';
import authController from '../controllers/authController';
import checkRoleHandler from '../middlewares/checkRoleHandler';

const authRoute = Router();

authRoute.post(
  '/signup/patient',
  validateSignUpPatient,
  authController.signUpPatient,
);
authRoute.post(
  '/signup/doctor',
  authenticateHandler,
  checkRoleHandler(['ADMIN']),
  validateSignUpDoctor,
  authController.signUpDoctor,
);
authRoute.post('/signin', validateSignIn, () => {});
authRoute.get('/me', authenticateHandler, () => {});

export default authRoute;
