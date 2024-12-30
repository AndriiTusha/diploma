import { Router } from 'express';
const router = Router();
import clientsController from "../controllers/clientsController.js";

router.post('/createClient', clientsController.createClient)
router.get('/getOneClient/:clientID', clientsController.getOneClient)
router.get('/editClient/:clientID', clientsController.editClient)
router.get('/getAllClients', clientsController.getAllClients)


export default router;


