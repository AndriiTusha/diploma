import { Router } from 'express';
const router = Router();

import diagnosticsController from '../controllers/diagnosticsController.js';
import repairsController from '../controllers/repairsController.js';
import maintenancesController from '../controllers/maintenancesController.js';

// Маршрути для діагностики
router.post('/diagnostics', diagnosticsController.createDiagnostics); // Створення запису
router.get('/diagnostics/vehicle/:vehicleId', diagnosticsController.getDiagnosticsByVehicle); // Отримання записів по автомобілю
router.get('/diagnostics/client/:clientId', diagnosticsController.getDiagnosticsByClient); // Отримання записів по клієнту

// Маршрути для ремонту
router.post('/repair', repairsController.createRepair); // Створення запису
router.get('/repair/vehicle/:vehicleId', repairsController.getRepairsByVehicle); // Отримання записів по автомобілю
router.get('/repair/client/:clientId', repairsController.getRepairsByClient); // Отримання записів по клієнту

// Маршрути для технічного обслуговування
router.post('/maintenance', maintenancesController.createMaintenance); // Створення запису
router.get('/maintenance/vehicle/:vehicleId', maintenancesController.getMaintenanceByVehicle); // Отримання записів по автомобілю
router.get('/maintenance/client/:clientId', maintenancesController.getMaintenanceByClient); // Отримання записів по клієнту


export default router;


