import {MaintenanceRecord, Vehicle} from '../models/models.js';
import ApiError from "../error/ApiError.js";

class MaintenanceController {
    // Створення нового запису про технічне обслуговування
    async createMaintenance(req, res, next) {
        try {
            const { vehicle_id, appointment_datetime, maintenance_description } = req.body;

            if (!vehicle_id || !appointment_datetime || !maintenance_description) {
                return next(ApiError.badRequest('All maintenance fields are required'));
            }

            const newMaintenance = await MaintenanceRecord.create({ vehicle_id, appointment_datetime, maintenance_description });

            return res.status(201).json(newMaintenance);
        } catch (error) {
            next(ApiError.internalError('Failed to create maintenance record'));
        }
    }

    // Отримання всіх записів про технічне обслуговування для конкретного автомобіля
    async getMaintenanceByVehicle(req, res, next) {
        try {
            const { vehicleId } = req.params;

            const maintenance = await MaintenanceRecord.findAll({ where: { vehicle_id: vehicleId } });

            if (!maintenance.length) {
                return next(ApiError.badRequest('No maintenance found for this vehicle'));
            }

            return res.status(200).json(maintenance);
        } catch (error) {
            next(ApiError.internalError('Failed to fetch maintenance'));
        }
    }

    // Отримання всіх записів про технічне обслуговування для конкретного клієнта
    async getMaintenanceByClient(req, res, next) {
        try {
            const { clientId } = req.params;

            const maintenance = await MaintenanceRecord.findAll({
                include: [
                    {
                        model: Vehicle,
                        where: { client_id: clientId },
                    },
                ],
            });

            if (!maintenance.length) {
                return next(ApiError.badRequest('No maintenance found for this client'));
            }

            return res.status(200).json(maintenance);
        } catch (error) {
            next(ApiError.internalError('Failed to fetch maintenance for client'));
        }
    }
}

const maintenanceController = new MaintenanceController();
export default maintenanceController;
