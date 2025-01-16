import { Router } from 'express';
const router = Router();
import paymentsController from "../controllers/paymentsController.js";
import {authMiddleware} from "../middleware/authMiddleware.js";
import {checkRole} from "../middleware/checkRole.js";

// Створення нового платежу
router.post('/createPayment/:vehicle_id', authMiddleware, checkRole(['Admin', 'Employee']), paymentsController.createPayment);

// Отримання всіх платежів для клієнта
router.get('/getAllPaymentsForClient/:client_id', paymentsController.getAllPaymentsForClient);

// Отримання всіх платежів для транспортного засобу
router.get('/getAllPaymentsPerVehicle/:vehicle_id',authMiddleware, checkRole(['Admin', 'Employee']), paymentsController.getAllPaymentsPerVehicle);

router.delete('/deletePayment/:paymentId', authMiddleware, checkRole(['Admin']), paymentsController.deletePayment);

// Редагування платежу
router.put('/editPayment/:paymentId', authMiddleware, checkRole(['Admin']), paymentsController.editPayment);

export default router;
