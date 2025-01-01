import {DiagnosticsRecord, Vehicle, Client} from '../models/models.js';
import ApiError from "../error/ApiError.js";

class DiagnosticsController {
    // Створення нового запису про діагностику
    async createDiagnostics(req, res, next) {
        try {
            const { vehicle_id, appointment_datetime, description } = req.body;

            // Перевірка наявності автомобіля
            const vehicle = await Vehicle.findByPk(vehicle_id, {
                include: [{ model: Client, attributes: ['id', 'name', 'surname'] }],
            });

            if (!vehicle) {
                return next(ApiError.badRequest('Vehicle not found'));
            }

            const client = vehicle.client;
            if (!client) {
                return next(ApiError.badRequest('Vehicle is not linked to any client'));
            }

            // Створення запису діагностики з client_id
            const newDiagnostics = await DiagnosticsRecord.create({
                vehicle_id: vehicle.id,
                client_id: client.id, // Додаємо client_id
                appointment_datetime,
                description,
            });

            // Формування відповіді
            const response = {
                ...newDiagnostics.toJSON(),
                client: { id: client.id, name: client.name, surname: client.surname },
            };

            return res.status(201).json(response);
        } catch (error) {
            next(ApiError.internalError('Failed to create diagnostics record'));
        }
    }



    // Отримання всіх записів по діагностиці для конкретного автомобіля
    async getDiagnosticsByVehicle(req, res, next) {
        try {
            const { vehicleId } = req.params;

            const diagnostics = await DiagnosticsRecord.findAll({ where: { vehicle_id: vehicleId } });

            if (!diagnostics.length) {
                return next(ApiError.badRequest('No diagnostics found for this vehicle'));
            }

            return res.status(200).json(diagnostics);
        } catch (error) {
            next(ApiError.internalError('Failed to fetch diagnostics'));
        }
    }

    // Отримання всіх записів по діагностиці для конкретного клієнта
    async getDiagnosticsByClient(req, res, next) {
        try {
            const { clientId } = req.params;

            const diagnostics = await DiagnosticsRecord.findAll({
                include: [
                    {
                        model: Vehicle,
                        where: { client_id: clientId },
                    },
                ],
            });

            if (!diagnostics.length) {
                return next(ApiError.badRequest('No diagnostics found for this client'));
            }

            return res.status(200).json(diagnostics);
        } catch (error) {
            next(ApiError.internalError('Failed to fetch diagnostics for client'));
        }
    }
}

const diagnosticsController = new DiagnosticsController();
export default diagnosticsController;
