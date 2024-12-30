import { Router } from 'express';
const router = Router();
import usersController from "../controllers/usersController.js";

router.post('/registration', usersController.registration)
router.get('/login', usersController.login)
router.get('/auth', usersController.check)

export default router;


