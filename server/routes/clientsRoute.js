import { Router } from 'express';
import clientsController from '../controllers/clientsController.js';
import { checkRole } from '../middleware/checkRole.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

// Створення нового клієнта (Admin або Employee)
router.post('/createClient', authMiddleware, checkRole(['Admin', 'Employee']), clientsController.createClient);

// Отримання клієнта за ID (Admin, Employee, Client)
router.get('/getOneClient/:email', authMiddleware, clientsController.getOneClient);

// Отримання всіх клієнтів (Admin або Employee)
router.get('/getAllClients', authMiddleware, checkRole(['Admin', 'Employee']), clientsController.getAllClients);

// Редагування клієнта (Admin)
router.put('/editClient/:clientID', authMiddleware, checkRole(['Admin']), clientsController.editClient);

router.delete('/deleteClient/:clientId', authMiddleware, checkRole(['Admin']), clientsController.deleteClient);

router.put('/setReminder/:clientId', authMiddleware, checkRole(['Admin', 'Employee']), clientsController.setReminder);

router.delete('/removeReminder/:clientId', authMiddleware, checkRole(['Admin', 'Employee']), clientsController.removeReminder);

router.post('/sendReminders', authMiddleware, checkRole(['Admin', 'Employee']), clientsController.sendRemindersManually);



export default router;
