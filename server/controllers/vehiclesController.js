import {Vehicle, Payment} from '../models/models.js'
import ApiError from "../error/ApiError.js";
import { v4 as uuidv4 } from "uuid";
import { fileURLToPath } from "url";
import path from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class VehiclesController {
    async createVehicle(req, res, next) {
        try {
            const {
                vin,
                mark,
                model,
                year,
                miles,
                diagnostics_history,
                repair_history,
                maintenance_history,
                client_id,
            } = req.body;

            let fileName = null; // За замовчуванням зображення немає

            // Перевіряємо, чи є файли у запиті
            if (req.files && req.files.img) {
                const { img } = req.files;

                // Перевіряємо, чи файл є зображенням
                if (!img.mimetype.startsWith("image/")) {
                    return next(ApiError.badRequest("Invalid file type. Only image files are allowed."));
                }

                // Генеруємо унікальну назву для файлу
                fileName = uuidv4() + path.extname(img.name);
                const uploadPath = path.resolve(__dirname, "../uploads/vehicles");

                // Зберігаємо файл
                await img.mv(path.join(uploadPath, fileName));
            }

            // Створюємо автомобіль
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
                img: fileName ? `uploads/vehicles/${fileName}` : null, // Якщо немає зображення, ставимо null
            });

            return res.json(vehicle);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }


    async updateVehiclePhoto(req, res, next) {
        try {
            const { vehicleID } = req.params;

            // Перевірка наявності файлу
            if (!req.files || !req.files.img) {
                return next(ApiError.badRequest('Image file is required'));
            }

            const { img } = req.files;

            // Перевірка типу файлу
            if (!img.mimetype.startsWith('image/')) {
                return next(ApiError.badRequest('Invalid file type. Only image files are allowed.'));
            }

            // Генерація унікальної назви для файлу
            const fileName = uuidv4() + path.extname(img.name);
            const uploadPath = path.resolve(__dirname, '../uploads/vehicles');

            // Збереження файлу
            await img.mv(path.join(uploadPath, fileName));

            // Оновлення запису в базі даних
            const vehicle = await Vehicle.findByPk(vehicleID);
            if (!vehicle) {
                return next(ApiError.badRequest('Vehicle not found'));
            }

            await vehicle.update({ img: `uploads/vehicles/${fileName}` });

            res.status(200).json({ message: 'Photo updated successfully', img: `uploads/vehicles/${fileName}` });
        } catch (error) {
            next(ApiError.internalError('Failed to update vehicle photo'));
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

    async deleteVehicle(req, res, next) {
        try {
            const { vehicleId } = req.params;

            // Знайти автомобіль
            const vehicle = await Vehicle.findByPk(vehicleId);
            if (!vehicle) {
                return res.status(404).json({ message: "Автомобіль не знайдено" });
            }

            // Видалити всі платежі, пов'язані з автомобілем
            await Payment.destroy({ where: { vehicle_id: vehicleId } });

            // Видалити автомобіль
            await vehicle.destroy();

            return res.status(200).json({ message: "Автомобіль успішно видалено разом із пов'язаними платежами" });
        } catch (error) {
            console.error("Помилка видалення автомобіля:", error);
            return next(ApiError.internalError("Не вдалося видалити автомобіль"));
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