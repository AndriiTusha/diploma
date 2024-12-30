import { Router } from 'express';
const router = Router();
import vehiclesController from '../controllers/vehiclesController.js'

router.post('/createVehicle', vehiclesController.createVehicle)
router.get('/getAllVehiclesForClient/:clientID', vehiclesController.getAllVehiclesForClient)
router.get('/getAllVehicles', vehiclesController.getAllVehicles)


export default router;

