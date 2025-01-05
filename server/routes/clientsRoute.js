import { Router } from 'express';
import clientsController from '../controllers/clientsController.js';
import { checkRole } from '../middleware/checkRole.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

// Створення нового клієнта (Admin або Employee)
router.post('/createClient', authMiddleware, checkRole(['Admin', 'Employee']), clientsController.createClient);

// Отримання клієнта за ID (Admin, Employee, Client)
router.get('/getOneClient/:clientID', authMiddleware, clientsController.getOneClient);

// Отримання всіх клієнтів (Admin або Employee)
router.get('/getAllClients', authMiddleware, checkRole(['Admin', 'Employee']), clientsController.getAllClients);

// Редагування клієнта (Admin або Employee)
router.put('/editClient/:clientID', authMiddleware, checkRole(['Admin', 'Employee']), clientsController.editClient);

export default router;
