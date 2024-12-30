import { Router } from 'express';
const router = Router();
import paymentsController from "../controllers/paymentsController.js";

// Створення нового платежу
router.post('/createPayment/:vehicle_id', paymentsController.createPayment);

// Отримання всіх платежів для клієнта
router.get('/getAllPaymentsForClient/:client_id', paymentsController.getAllPaymentsForClient);

// Отримання всіх платежів для транспортного засобу
router.get('/getAllPaymentsPerVehicle/:vehicle_id', paymentsController.getAllPaymentsPerVehicle);

export default router;
