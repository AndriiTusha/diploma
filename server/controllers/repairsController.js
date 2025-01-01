import { RepairRecord, Vehicle, Client } from '../models/models.js';
import ApiError from "../error/ApiError.js";

class RepairsController {
    // Створення нового запису про ремонт
    async createRepair(req, res, next) {
        try {
            const { vehicle_id, appointment_datetime, repair_description } = req.body;

            if (!vehicle_id || !appointment_datetime || !repair_description) {
                return next(ApiError.badRequest('All repair fields are required'));
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

            // Створення запису про ремонт із `client_id`
            const newRepair = await RepairRecord.create({
                vehicle_id: vehicle.id,
                client_id: client.id, // Зберігаємо client_id
                appointment_datetime,
                repair_description,
            });

            return res.status(201).json({
                ...newRepair.toJSON(),
                client: { id: client.id, name: client.name, surname: client.surname },
            });
        } catch (error) {
            console.error('Error creating repair record:', error.message);
            next(ApiError.internalError('Failed to create repair record'));
        }
    }

    // Редагування запису про ремонт
    async editRepair(req, res, next) {
        try {
            const { repairId } = req.params; // ID запису ремонту
            const { appointment_datetime, repair_description } = req.body;

            console.log(`Updating repair with ID: ${repairId}`);
            console.log('Request body:', req.body);

            // Знаходимо запис у базі
            const repair = await RepairRecord.findByPk(repairId);

            if (!repair) {
                console.error(`Repair with ID ${repairId} not found`);
                return next(ApiError.badRequest('Repair record not found'));
            }

            console.log('Repair record found:', repair);

            // Оновлення полів запису
            await repair.update({
                ...(appointment_datetime && { appointment_datetime }),
                ...(repair_description && { repair_description }),
            });

            console.log('Updated repair record:', repair);

            return res.status(200).json(repair); // Повертаємо оновлений запис
        } catch (error) {
            console.error('Error updating repair record:', error.message);
            next(ApiError.internalError('Failed to update repair record'));
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
            console.error('Error fetching repairs by vehicle:', error.message);
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
            console.error('Error fetching repairs by client:', error.message);
            next(ApiError.internalError('Failed to fetch repairs for client'));
        }
    }
}

const repairController = new RepairsController();
export default repairController;
