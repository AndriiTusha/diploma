import {Vehicle} from '../models/models.js'
import ApiError from "../error/ApiError.js";
import { v4 as uuidv4 } from "uuid";
import { fileURLToPath } from "url";
import path from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class VehiclesController {
    async createVehicle(req, res, next) {
        try {
            const { vin, mark, model, year, miles, diagnostics_history, repair_history, maintenance_history, client_id } = req.body;

            if (!req.files || !req.files.img) {
                return next(ApiError.badRequest("Image file is required"));
            }

            const { img } = req.files;

            if (!img.mimetype.startsWith("image/")) {
                return next(ApiError.badRequest("Invalid file type. Only image files are allowed."));
            }

            let fileName = uuidv4() + path.extname(img.name);
            const uploadPath = path.resolve(__dirname, "../uploads/vehicles");

            await img.mv(path.join(uploadPath, fileName));

            const vehicle = await Vehicle.create({
                vin,
                mark,
                model,
                year,
                miles,
                diagnostics_history,
                repair_history,
                maintenance_history,
                client_id,
                img: `uploads/vehicles/${fileName}`,
            });

            return res.json(vehicle);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
    async getAllVehiclesForClient(req, res, next) {
        try {
            const { clientID } = req.params;
            // Перевірка, чи є clientId в запиті
            if (!clientID) {
                return next(ApiError.badRequest('Client ID is required'));
            }

            // Отримуємо автомобілі для клієнта
            const vehicles = await Vehicle.findAll({
                where: { client_id: clientID },
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

    async editVehicle(req, res, next) {
        try {
            const { vehicleID } = req.params; // Отримуємо ID автомобіля з параметрів запиту
            const { vin, mark, model, year, miles, diagnostics_history, repair_history, maintenance_history } = req.body;

            const vehicle = await Vehicle.findByPk(vehicleID); // Знаходимо автомобіль у базі

            if (!vehicle) {
                return next(ApiError.badRequest('Vehicle not found'));
            }

            // Оновлення полів автомобіля
            await vehicle.update({
                ...(vin && { vin }),
                ...(mark && { mark }),
                ...(model && { model }),
                ...(year && { year }),
                ...(miles && { miles }),
                ...(diagnostics_history && { diagnostics_history }),
                ...(repair_history && { repair_history }),
                ...(maintenance_history && { maintenance_history }),
            });

            return res.status(200).json(vehicle); // Повертаємо оновлений автомобіль
        } catch (error) {
            next(ApiError.internalError('Failed to update vehicle'));
        }
    }

    async getAllVehicles(req, res, next) {
        try {
            const limit = parseInt(req.query.limit, 10) || 10; // За замовчуванням 10 записів на сторінку
            const page = parseInt(req.query.page, 10) || 1; // За замовчуванням перша сторінка
            const offset = (page - 1) * limit; // Розрахунок зсуву

            // Отримання списку автомобілів
            const vehicles = await Vehicle.findAndCountAll({
                limit: limit, // Явно передаємо як число
                offset: offset, // Явно передаємо як число
            });

            // Формуємо відповідь
            const response = {
                totalItems: vehicles.count,
                totalPages: Math.ceil(vehicles.count / limit),
                currentPage: page,
                data: vehicles.rows,
            };

            return res.status(200).json(response);
        } catch (error) {
            next(ApiError.internalError('Failed to fetch vehicles with pagination'));
        }
    }
}

const vehiclesController = new VehiclesController();
export default vehiclesController;