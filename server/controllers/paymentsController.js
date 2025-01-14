import { Payment, Vehicle, Client } from '../models/models.js';
import ApiError from '../error/ApiError.js';

class PaymentsController {
    // Створення нового платежу
    async createPayment(req, res, next) {
        try {
            const { vehicle_id } = req.params;
            const { payment_date, amount, discount_type, payment_status } = req.body;

           // Перевірка необхідних полів
            if (!vehicle_id || !payment_date || !amount) {
                return next(ApiError.badRequest('Vehicle ID, payment date, and amount are required'));
            }

            // Перевірка наявності транспортного засобу
            const vehicle = await Vehicle.findByPk(vehicle_id, {
                include: [{ model: Client, attributes: [
                    'id', 'name' , 'middle_name', 'surname', 'contact_email', 'contact_phone' , 'service_history', 'reminders'
                    ] }],
            });

            if (!vehicle) {
                return next(ApiError.badRequest('Vehicle with the provided ID not found'));
            }

            const client = vehicle.client;
            if (!client) {
                return next(ApiError.badRequest('Vehicle is not linked to any client'));
            }

            // Створення нового платежу
            const newPayment = await Payment.create({
                client_id: client.id,
                vehicle_id: vehicle.id,
                payment_date,
                amount,
                discount_type,
                payment_status,
            });

            return res.status(201).json(newPayment);
        } catch (error) {
            next(ApiError.internalError('Failed to create payment'));
        }
    }

    // Редагування існуючого платежу
    async editPayment(req, res, next) {
        try {
            const { paymentId } = req.params; // Отримуємо ID платежу з параметрів запиту
            const { payment_date, amount, discount_type, payment_status } = req.body;

            // Знаходимо платіж у базі
            const payment = await Payment.findByPk(paymentId);

            if (!payment) {
               return next(ApiError.badRequest('Payment not found'));
            }

            // Оновлення полів платежу
            await payment.update({
                ...(payment_date && { payment_date }),
                ...(amount && { amount }),
                ...(discount_type && { discount_type }),
                ...(payment_status && { payment_status }),
            });
            return res.status(200).json(payment); // Повертаємо оновлений платіж
        } catch (error) {
            next(ApiError.internalError('Failed to update payment'));
        }
    }


    // Отримання всіх платежів для клієнта
    async getAllPaymentsForClient(req, res, next) {
        try {
            const { client_id } = req.params;

            const payments = await Payment.findAll({ where: { client_id } });

            if (!payments.length) {
                return next(ApiError.badRequest('No payments found for this client'));
            }

            return res.status(200).json(payments);
        } catch (error) {
            next(ApiError.internalError('Failed to fetch payments for client'));
        }
    }

    // Отримання всіх платежів для конкретного автомобіля по VIN
    async getAllPaymentsPerVehicle(req, res, next) {
        try {
            const { vehicle_id } = req.params;
            // Перевірка існування автомобіля
            const vehicle = await Vehicle.findByPk(vehicle_id);
            if (!vehicle) {
                return res.status(404).json({ message: `Автомобіль з ID ${vehicle_id} не знайдено.` });
            }
            const payments = await Payment.findAll({ where: { vehicle_id } });

            if (!payments.length) {
                return next(ApiError.badRequest('No payments found for this vehicle'));
            }

            return res.status(200).json(payments);
        } catch (error) {
            next(ApiError.internalError('Failed to fetch payments for vehicle'));
        }
    }

    async deletePayment(req, res, next) {
        try {
            const { paymentId } = req.params;

            // Знайти платіж
            const payment = await Payment.findByPk(paymentId);
            if (!payment) {
                return res.status(404).json({ message: "Платіж не знайдено" });
            }

            // Видалити платіж
            await payment.destroy();

            return res.status(200).json({ message: "Платіж успішно видалено" });
        } catch (error) {
            console.error("Помилка видалення платежу:", error);
            return next(ApiError.internalError("Не вдалося видалити платіж"));
        }
    }

}

const paymentsController = new PaymentsController();
export default paymentsController;
