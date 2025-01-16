import { Client, Vehicle, Payment } from '../models/models.js';
import ApiError from "../error/ApiError.js";
import {checkAndSendReminders} from "../utils/emailReminder.js";

class ClientsController {
    // Створення нового клієнта
    async createClient(req, res, next) {
        try {
            const { name, middle_name, surname, contact_email, contact_phone, reminders } = req.body;

            if (!name || !surname || !contact_email || !contact_phone) {
                return next(ApiError.badRequest('All required fields must be filled'));
            }

            // Перевірка унікальності контактного email і телефону
            const existingClient = await Client.findOne({ where: { contact_email } });
            if (existingClient) {
                return next(ApiError.badRequest('Client with this contact email already exists'));
            }

            const existingPhone = await Client.findOne({ where: { contact_phone } });
            if (existingPhone) {
                return next(ApiError.badRequest('Client with this contact phone already exists'));
            }

            // Створення клієнта
            const client = await Client.create({
                name,
                middle_name,
                surname,
                contact_email,
                contact_phone,
            });

            return res.status(201).json(client);
        } catch (error) {
            return next(ApiError.internalError(error.message));
        }
    }

    // Отримання клієнта за ID
    async getOneClient(req, res, next) {
        try {
            const { email } = req.params;

            if (!email) {
                return next(ApiError.badRequest('Email is required'));
            }

            const client = await Client.findOne({ where: { contact_email: email } });

            if (!client) {
                return next(ApiError.badRequest('Client not found'));
            }

            return res.status(200).json(client);
        } catch (error) {
            next(ApiError.internalError('Failed to fetch client by email'));
        }
    }


    // Оновлення даних клієнта
    async editClient(req, res, next) {
        try {
            const { clientID } = req.params;

            // Перевірка, чи clientID є числом
            if (isNaN(clientID)) {
                return next(ApiError.badRequest('Invalid client ID'));
            }

            // Отримання клієнта
            const client = await Client.findByPk(clientID);

            if (!client) {
                return next(ApiError.badRequest('Client not found'));
            }

            // Оновлення полів, які передані
            const updatedData = {
                ...(req.body.name && { name: req.body.name }),
                ...(req.body.middle_name && { middle_name: req.body.middle_name }),
                ...(req.body.surname && { surname: req.body.surname }),
                ...(req.body.contact_email && { contact_email: req.body.contact_email }),
                ...(req.body.contact_phone && { contact_phone: req.body.contact_phone }),
                ...(req.body.service_history && { service_history: req.body.service_history }),
                ...(req.body.reminders && { reminders: req.body.reminders }),
            };

            await client.update(updatedData);
            return res.status(200).json(client);
        } catch (error) {
            next(ApiError.internalError('Failed to update client'));
        }
    }

    // Отримання всіх клієнтів
    async getAllClients(req, res, next) {
        try {
            const userRole = req.user.role;

            // Перевірка ролі
            if (userRole !== 'Admin' && userRole !== 'Employee') {
                return next(ApiError.forbidden('Access denied'));
            }

            const limit = parseInt(req.query.limit, 10) || 10;
            const page = parseInt(req.query.page, 10) || 1;
            const offset = (page - 1) * limit;

            const clients = await Client.findAndCountAll({
                limit: limit,
                offset: offset,
                order: [['id', 'ASC']],
            });

            const response = {
                totalItems: clients.count,
                totalPages: Math.ceil(clients.count / limit),
                currentPage: page,
                data: clients.rows,
            };

            return res.status(200).json(response);
        } catch (error) {
            next(ApiError.internalError('Failed to fetch clients with pagination'));
        }
    }

    async deleteClient(req, res, next) {
        try {
            const { clientId } = req.params;

            // Знайти клієнта
            const client = await Client.findByPk(clientId);

            if (!client) {
                return res.status(404).json({ message: "Клієнт не знайдений" });
            }

            // Видалити всі автомобілі клієнта
            const vehicles = await Vehicle.findAll({ where: { client_id: clientId } });
            for (const vehicle of vehicles) {
                // Видалити платежі для кожного автомобіля
                await Payment.destroy({ where: { vehicle_id: vehicle.id } });
                // Видалити автомобіль
                await vehicle.destroy();
            }

            // Видалити клієнта
            await client.destroy();

            return res.status(200).json({ message: "Клієнта успішно видалено разом із пов'язаними даними" });
        } catch (error) {
            next(ApiError.internalError("Не вдалося видалити клієнта"));
        }
    };

    //додавання нагадувань
    async setReminder(req, res, next) {
        try {
            const { clientId } = req.params;
            const { text, date } = req.body;

            const client = await Client.findByPk(clientId);
            if (!client) {
                return res.status(404).json({ message: "Клієнт не знайдений" });
            }

            client.reminders = { remind: true, text, date };
            await client.save();

            return res.status(200).json({ message: "Нагадування збережено успішно" });
        } catch (error) {
            console.error("Помилка збереження нагадування:", error);
            next(ApiError.internalError("Не вдалося зберегти нагадування"));
        }
    }

    //видалення нагадувань
    async removeReminder(req, res, next) {
        try {
            const { clientId } = req.params;

            const client = await Client.findByPk(clientId);
            if (!client) {
                return res.status(404).json({ message: "Клієнт не знайдений" });
            }

            client.reminders = null; // Видаляємо нагадування
            await client.save();

            return res.status(200).json({ message: "Нагадування успішно видалено" });
        } catch (error) {
            console.error("Помилка видалення нагадування:", error);
            next(ApiError.internalError("Не вдалося видалити нагадування"));
        }
    }

    //тестування відправлення нагадувань
    async sendRemindersManually(req, res, next) {
        try {
            await checkAndSendReminders(); // Викликаємо функцію перевірки
            return res.status(200).json({ message: "Нагадування успішно відправлено вручну" });
        } catch (error) {
            console.error("Помилка під час відправки нагадувань:", error);
            next(ApiError.internalError("Не вдалося відправити нагадування"));
        }
    }

}

const clientsController = new ClientsController();
export default clientsController;
