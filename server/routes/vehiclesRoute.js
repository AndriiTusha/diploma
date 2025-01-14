import { Router } from 'express';
const router = Router();
import vehiclesController from '../controllers/vehiclesController.js'
import {authMiddleware} from "../middleware/authMiddleware.js";
import {checkRole} from "../middleware/checkRole.js";

router.post('/createVehicle', vehiclesController.createVehicle)
router.get('/getAllVehiclesForClient/:clientID', vehiclesController.getAllVehiclesForClient)
router.get('/getAllVehicles', vehiclesController.getAllVehicles)
router.put('/editVehicle/:vehicleID', vehiclesController.editVehicle)
router.put('/updateVehiclePhoto/:vehicleID', vehiclesController.updateVehiclePhoto)
router.delete('/deleteVehicle/:vehicleId', authMiddleware, checkRole(['Admin', 'Employee']), vehiclesController.deleteVehicle);


export default router;


