import { Router } from 'express';
const router = Router();
import paymentsController from "../controllers/paymentsController.js";

router.post('/createPayment', paymentsController.createPayment)
router.get('/getAllPaymentsForClient/:clientID', paymentsController.getAllPaymentsForClient)
router.get('/getAllPaymentsPerVIN/:vin', paymentsController.getAllPaymentsPerVIN)


export default router;


