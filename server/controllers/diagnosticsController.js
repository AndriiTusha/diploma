import {DiagnosticsRecord, Vehicle} from '../models/models.js';
import ApiError from "../error/ApiError.js";

class DiagnosticsController {
    // Створення нового запису про діагностику
    async createDiagnostics(req, res, next) {
        try {
            const { vehicle_id, appointment_datetime, description } = req.body;

            if (!vehicle_id || !appointment_datetime) {
                return next(ApiError.badRequest('All diagnostic fields are required'));
            }

            const newDiagnostics = await DiagnosticsRecord.create({ vehicle_id, appointment_datetime, description });

            return res.status(201).json(newDiagnostics);
        } catch (error) {
            next(ApiError.internalError('Failed to create diagnostic record'));
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
