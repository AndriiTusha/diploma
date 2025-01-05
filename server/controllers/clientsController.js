import { Client } from '../models/models.js';
import ApiError from "../error/ApiError.js";

class ClientsController {
    // Створення нового клієнта
    async createClient(req, res, next) {
        try {
            const { name, middle_name, surname, contact_email, contact_phone, service_history, reminders } = req.body;

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
                service_history,
                reminders,
            });

            return res.status(201).json(client);
        } catch (error) {
            return next(ApiError.internalError(error.message));
        }
    }

    // Отримання клієнта за ID
    async getOneClient(req, res, next) {
        try {
            const { clientID } = req.params;
            const userRole = req.user.role; // Роль із токена
            const userEmail = req.user.email; // Email із токена

            // Отримання клієнта за ID
            const client = await Client.findByPk(clientID);

            if (!client) {
                return next(ApiError.badRequest('Client not found'));
            }

            // Якщо роль Client, перевіряємо, чи збігається email
            if (userRole === 'Client' && client.contact_email !== userEmail) {
                return next(ApiError.forbidden('Access denied'));
            }

            // Якщо роль Admin або Employee, повертаємо клієнта
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
}

const clientsController = new ClientsController();
export default clientsController;
