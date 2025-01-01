import { Router } from 'express';
const router = Router();

import diagnosticsController from '../controllers/diagnosticsController.js';
import repairsController from '../controllers/repairsController.js';
import maintenancesController from '../controllers/maintenancesController.js';

// Маршрути для діагностики
router.post('/diagnostics/create', diagnosticsController.createDiagnostics); // Створення запису
router.get('/diagnostics/get_vehicle/:vehicleId', diagnosticsController.getDiagnosticsByVehicle); // Отримання записів по автомобілю
router.get('/diagnostics/get_client/:clientId', diagnosticsController.getDiagnosticsByClient); // Отримання записів по клієнту

// Маршрути для ремонту
router.post('/repairs/create', repairsController.createRepair); // Створення запису
router.get('/repairs/get_vehicle/:vehicleId', repairsController.getRepairsByVehicle); // Отримання записів по автомобілю
router.get('/repairs/get_client/:clientId', repairsController.getRepairsByClient); // Отримання записів по клієнту

// Маршрути для технічного обслуговування
router.post('/maintenances/create', maintenancesController.createMaintenance); // Створення запису
router.get('/maintenances/get_vehicle/:vehicleId', maintenancesController.getMaintenanceByVehicle); // Отримання записів по автомобілю
router.get('/maintenances/get_client/:clientId', maintenancesController.getMaintenanceByClient); // Отримання записів по клієнту


export default router;


