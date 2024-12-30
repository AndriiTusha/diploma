import {RepairRecord, Vehicle} from '../models/models.js';
import ApiError from "../error/ApiError.js";

class RepairsController {
    // Створення нового запису про ремонт
    async createRepair(req, res, next) {
        try {
            const { vehicle_id, appointment_datetime, repair_description } = req.body;

            if (!vehicle_id || !appointment_datetime || !repair_description) {
                return next(ApiError.badRequest('All repair fields are required'));
            }

            const newRepair = await RepairRecord.create({ vehicle_id, appointment_datetime, repair_description });

            return res.status(201).json(newRepair);
        } catch (error) {
            next(ApiError.internalError('Failed to create repair record'));
        }
    }

    // Отримання всіх записів про ремонт для конкретного автомобіля
    async getRepairsByVehicle(req, res, next) {
        try {
            const { vehicleId } = req.params;

            const repairs = await RepairRecord.findAll({ where: { vehicle_id: vehicleId } });

            if (!repairs.length) {
                return next(ApiError.badRequest('No repairs found for this vehicle'));
            }

            return res.status(200).json(repairs);
        } catch (error) {
            next(ApiError.internalError('Failed to fetch repairs'));
        }
    }

    // Отримання всіх записів про ремонт для конкретного клієнта
    async getRepairsByClient(req, res, next) {
        try {
            const { clientId } = req.params;

            const repairs = await RepairRecord.findAll({
                include: [
                    {
                        model: Vehicle,
                        where: { client_id: clientId },
                    },
                ],
            });

            if (!repairs.length) {
                return next(ApiError.badRequest('No repairs found for this client'));
            }

            return res.status(200).json(repairs);
        } catch (error) {
            next(ApiError.internalError('Failed to fetch repairs for client'));
        }
    }
}

const repairController = new RepairsController();
export default repairController;
