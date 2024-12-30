import {Vehicle} from '../models/models.js'
import ApiError from "../error/ApiError.js";

class VehiclesController {
    async createVehicle (req, res) {
        const { vin, mark ,model, year, miles, diagnostics_history, repair_history, maintenance_history } = req.body;
        const vehicle = await Vehicle.create({vin, mark ,model, year, miles, diagnostics_history, repair_history, maintenance_history})
        return res.json(vehicle)
    }
    async getAllVehiclesForClient(req, res, next) {
        try {
            const { clientId } = req.params;

            // Перевірка, чи є clientId в запиті
            if (!clientId) {
                return next(ApiError.badRequest('Client ID is required'));
            }

            // Отримуємо автомобілі для клієнта
            const vehicles = await Vehicle.findAll({
                where: { client_id: clientId },
            });

            // Якщо автомобілі не знайдені
            if (vehicles.length === 0) {
                return next(ApiError.badRequest('No vehicles found for this client'));
            }

            // Повертаємо список автомобілів
            return res.status(200).json(vehicles);
        } catch (error) {
            // Обробка несподіваних помилок
            next(ApiError.internalError('Failed to fetch vehicles for client'));
        }
    }

    async getAllVehicles (req, res) {
        const vehicles = await Vehicle.findAll()
        return res.json(vehicles)
    }
}

const vehiclesController = new VehiclesController();
export default vehiclesController;