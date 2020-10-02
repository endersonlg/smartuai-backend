import { Router } from 'express';
import multer from 'multer';
// import fs from 'fs';
import multerConfig from './config/multer';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import CityController from './app/controllers/CityController';
import StateController from './app/controllers/StateController';
import FileController from './app/controllers/FileController';
import DeviceController from './app/controllers/DeviceController';
import SuggestionController from './app/controllers/SuggestionController';

import AuthMiddleware from './app/middlewares/auth';
import DamageReportController from './app/controllers/DamageReportController';
import TodoController from './app/controllers/TodoController';
import StatusController from './app/controllers/StatusController';

const routes = new Router();

const upload = multer(multerConfig);

routes.get('/states', StateController.listStates);
routes.get('/states/:state', StateController.listCities);

routes.post('/sessions', SessionController.store);

routes.post('/users', UserController.store);

routes.post('/cities', CityController.store);
routes.get('/cities/:id', CityController.index);

routes.post('/files', upload.single('file'), FileController.store);
// routes.post('/files', FileController.store);

routes.post('/history', StatusController.store);

routes.use(AuthMiddleware);

routes.put('/cities/:id', CityController.update);
routes.get('/cities', CityController.list);
routes.delete('/cities/:id', CityController.delete);

routes.get(
  '/devices/amountMonthYear',
  DeviceController.amountDeviceMonthAndYear
);
routes.post('/devices', DeviceController.store);
routes.put('/devices/:id', DeviceController.update);
routes.get('/devices', DeviceController.list);
routes.get('/devices/:id', DeviceController.index);
routes.delete('/devices/:id', DeviceController.delete);

routes.get('/users/amountMonthYear', UserController.amountUserMonthAndYear);
routes.put('/users', UserController.update);
routes.get('/users', UserController.list);
routes.get('/users/:id', UserController.index);

routes.get(
  '/suggestions/amountSolicitationStatus',
  SuggestionController.amountSolicitationStatus
);
routes.post('/suggestions', SuggestionController.store);
routes.get('/suggestions', SuggestionController.list);
routes.get('/suggestions/:id', SuggestionController.index);
routes.put('/suggestions/:id', SuggestionController.update);

routes.get(
  '/damageReports/amountDamageReportStatus',
  DamageReportController.amountDamageReportStatus
);
routes.post('/damageReports', DamageReportController.store);
routes.get('/damageReports', DamageReportController.list);
routes.get('/damageReports/:id', DamageReportController.index);
routes.put('/damageReports/:id', DamageReportController.update);

routes.get('/todo', TodoController.list);

export default routes;
