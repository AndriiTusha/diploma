import { Client } from '../models/models.js';
import ApiError from "../error/ApiError.js";
import {Op} from "sequelize";

class ClientsController {
    // Створення нового клієнта
    async createClient(req, res, next) {
        try {
            const { name, middle_name, surname, contact_email, contact_phone, service_history, reminders } = req.body;

            if (!name || !middle_name || !surname || !contact_email || !contact_phone) {
                return next(ApiError.badRequest('All client fields are required'));
            }

            // Перевірка наявності клієнта з таким email або телефоном
            const existingClient = await Client.findOne({
                where: {
                    [Op.or]: [{ contact_email }, { contact_phone }],
                },
            });

            if (existingClient) {
                return next(ApiError.badRequest('Client with this email or phone number already exists'));
            }

            // Створення клієнта
            const newClient = await Client.create({ name, middle_name, surname, contact_email, contact_phone, service_history, reminders });
            return res.status(201).json(newClient);
        } catch (error) {
            next(ApiError.internalError('Failed to create client'));
        }
    }

    // Отримання клієнта за ID
    async getOneClient(req, res, next) {
        try {
            const { clientID } = req.params;
            const client = await Client.findByPk(clientID);

            if (!client) {
                return next(ApiError.badRequest('Client not found'));
            }
            return res.status(200).json(client);
        } catch (error) {
            next(ApiError.internalError('Failed to fetch client'));
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
            const limit = parseInt(req.query.limit, 10) || 10; // Кількість записів на сторінку, за замовчуванням 10
            const page = parseInt(req.query.page, 10) || 1; // Номер сторінки, за замовчуванням 1
            const offset = (page - 1) * limit; // Розрахунок зсуву

            // Отримання клієнтів із пагінацією
            const clients = await Client.findAndCountAll({
                limit: limit, // Обмеження записів
                offset: offset, // Зсув
                order: [['id', 'ASC']], // Сортування за ID у зростаючому порядку
            });

            // Формування відповіді
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
}

const clientsController = new ClientsController();
export default clientsController;
