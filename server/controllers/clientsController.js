import { Client } from '../models/models.js';
import ApiError from "../error/ApiError.js";

class ClientsController {
    // Створення нового клієнта
    async createClient(req, res, next) {
        try {
            const { name, middle_name, surname, contact_email, contact_phone, service_history, reminders } = req.body;

            if (!name || !middle_name || !surname || !contact_email || !contact_phone) {
                return next(ApiError.badRequest('All client fields are required'));
            }

            const newClient = await Client.create({ name, middle_name, surname, contact_email, contact_phone, service_history, reminders });

            return res.status(201).json(newClient);
        } catch (error) {
            next(ApiError.internalError('Failed to create client'));
        }
    }

    // Отримання клієнта за ID
    async getOneClient(req, res, next) {
        try {
            const { clientId } = req.params;

            const client = await Client.findByPk(clientId);

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
            const { clientId } = req.params;
            const { name, middle_name, surname, contact_email, contact_phone, service_history, reminders } = req.body;

            const client = await Client.findByPk(clientId);

            if (!client) {
                return next(ApiError.badRequest('Client not found'));
            }

            await client.update({ name, middle_name, surname, contact_email, contact_phone, service_history, reminders });

            return res.status(200).json(client);
        } catch (error) {
            next(ApiError.internalError('Failed to update client'));
        }
    }

    // Отримання всіх клієнтів
    async getAllClients(req, res) {
        const clients = await Client.findAll();
        return res.status(200).json(clients);
    }
}

const clientsController = new ClientsController();
export default clientsController;
