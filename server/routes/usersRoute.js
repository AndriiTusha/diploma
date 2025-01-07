import { Router } from 'express';
import usersController from '../controllers/usersController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

// Маршрут для реєстрації
router.post('/register', usersController.registration);

// Підтвердження реєстрації
router.post('/verify', usersController.verifyUser);

// Маршрут для логіну
router.post('/login', usersController.login);

// Перевірка автентифікації
router.get('/check', authMiddleware, usersController.check);

export default router;



