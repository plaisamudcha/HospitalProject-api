import { Router } from 'express';
import doctorController from '../controllers/doctorController';

const doctorRoute = Router();

doctorRoute.get('/', doctorController.listDoctors);
doctorRoute.get('/:id', () => {});
doctorRoute.put('/:id', () => {});
doctorRoute.patch('/:id', () => {});

export default doctorRoute;
