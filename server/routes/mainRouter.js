import { Router } from 'express';
const router = Router();
import clientsRoute from "./clientsRoute.js";
import vehiclesRoute from "./vehiclesRoute.js";
import usersRoute from "./usersRoute.js";
import paymentsRoute from "./paymentsRoute.js";
import servicesRoute from "./servicesRoute.js";

router.use('/auth', usersRoute);
router.use('/clients', clientsRoute);
router.use('/vehicles', vehiclesRoute);
router.use('/payments', paymentsRoute);
router.use('/services', servicesRoute);

export default router;