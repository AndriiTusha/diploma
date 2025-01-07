import { Router } from 'express';
import usersController from '../controllers/usersController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

// Маршрут для реєстрації
router.post('/register', usersController.registration);

// Підтвердження верифікації
router.post('/verify', usersController.verifyUser);

// Нагадування паролю
router.post('/remind-password', usersController.remindPassword);

// Маршрут для логіну
router.post('/login', usersController.login);

// Перевірка автентифікації
router.get('/check', authMiddleware, usersController.check);

export default router;



