import { Router } from 'express';
import {
  validateForgotPassword,
  validateResetPassword,
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
authRoute.post('/signin', validateSignIn, authController.signIn);
authRoute.get('/refresh-token', authController.refreshToken);
authRoute.get('/me', authenticateHandler, authController.getCurrentUser);
authRoute.post(
  '/forgot-password',
  validateForgotPassword,
  authController.forgotPassword,
);
authRoute.post(
  '/reset-password/:token',
  validateResetPassword,
  authController.resetPassword,
);

export default authRoute;
