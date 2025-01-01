import { MaintenanceRecord, Vehicle, Client } from '../models/models.js';
import ApiError from "../error/ApiError.js";

class MaintenanceController {
    // Створення нового запису про технічне обслуговування
    async createMaintenance(req, res, next) {
        try {
            const { vehicle_id, appointment_datetime, maintenance_description } = req.body;

            if (!vehicle_id || !appointment_datetime || !maintenance_description) {
                return next(ApiError.badRequest('All maintenance fields are required'));
            }

            // Перевірка наявності автомобіля
            const vehicle = await Vehicle.findByPk(vehicle_id, {
                include: [{ model: Client, attributes: ['id', 'name', 'surname'] }],
            });

            if (!vehicle) {
                return next(ApiError.badRequest('Vehicle with the provided ID not found'));
            }

            const client = vehicle.client;
            if (!client) {
                return next(ApiError.badRequest('Vehicle is not linked to any client'));
            }

            // Створення запису технічного обслуговування із `client_id`
            const newMaintenance = await MaintenanceRecord.create({
                vehicle_id: vehicle.id,
                client_id: client.id, // Зберігаємо client_id
                appointment_datetime,
                maintenance_description,
            });

            return res.status(201).json({
                ...newMaintenance.toJSON(),
                client: { id: client.id, name: client.name, surname: client.surname },
            });
        } catch (error) {
            next(ApiError.internalError('Failed to create maintenance record'));
        }
    }


    // Отримання всіх записів про технічне обслуговування для конкретного автомобіля
    async getMaintenanceByVehicle(req, res, next) {
        try {
            const { vehicleId } = req.params;

            const maintenance = await MaintenanceRecord.findAll({
                where: { vehicle_id: vehicleId },
                include: [
                    {
                        model: Vehicle,
                        attributes: ['id', 'vin', 'mark' , 'model', 'year'], // Додати необхідні поля
                    },
                    {
                        model: Client,
                        attributes: ['id', 'name', 'surname' , 'contact_email', 'contact_phone'], // Додати необхідні поля
                    }
                ],
            });

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
                where: { client_id: clientId },
                include: [
                    {
                        model: Vehicle,
                        attributes: ['id', 'vin', 'mark' , 'model', 'year'], // Додати необхідні поля
                    },
                    {
                        model: Client,
                        attributes: ['id', 'name', 'surname' , 'contact_email', 'contact_phone'], // Додати необхідні поля
                    }
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
