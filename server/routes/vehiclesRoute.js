import { Router } from 'express';
const router = Router();
import vehiclesController from '../controllers/vehiclesController.js'
import {authMiddleware} from "../middleware/authMiddleware.js";
import {checkRole} from "../middleware/checkRole.js";

router.post('/createVehicle',authMiddleware, checkRole(['Admin', 'Employee']), vehiclesController.createVehicle)
router.get('/getAllVehiclesForClient/:clientID', vehiclesController.getAllVehiclesForClient)
router.get('/getAllVehicles', authMiddleware, checkRole(['Admin', 'Employee']), vehiclesController.getAllVehicles)
router.put('/editVehicle/:vehicleID', authMiddleware, checkRole(['Admin']), vehiclesController.editVehicle)
router.put('/updateVehiclePhoto/:vehicleID',authMiddleware, checkRole(['Admin', 'Employee']), vehiclesController.updateVehiclePhoto)
router.delete('/deleteVehicle/:vehicleId', authMiddleware, checkRole(['Admin']), vehiclesController.deleteVehicle);
router.get('/readErrors/:vehicleId', authMiddleware, checkRole(['Admin', 'Employee']), vehiclesController.readErrors);


export default router;


