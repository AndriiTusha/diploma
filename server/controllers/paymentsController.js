import { Payment } from '../models/models.js';
import { Vehicle } from '../models/models.js';
import ApiError from '../error/ApiError.js';

class PaymentsController {
    // Створення нового платежу
    async createPayment(req, res, next) {
        try {
            const { vin, payment_date, amount, discount_type, payment_status } = req.body;

            console.log('Received POST /createPayment request'); // Лог для перевірки запиту
            console.log('Request body:', req.body); // Лог даних запиту

            // Перевірка необхідних полів
            if (!vin || !payment_date || !amount) {
                console.log('Missing required fields');
                return next(ApiError.badRequest('VIN, payment date, and amount are required'));
            }

            // Пошук автомобіля за VIN
            const vehicle = await Vehicle.findOne({ where: { vin } });

            if (!vehicle) {
                console.log('Vehicle not found');
                return next(ApiError.badRequest('Vehicle with the provided VIN not found'));
            }

            console.log('Found vehicle:', vehicle); // Лог знайденого авто

            // Створення нового платежу
            const newPayment = await Payment.create({
                client_id: vehicle.client_id,
                vehicle_id: vehicle.id,
                payment_date,
                amount,
                discount_type,
                payment_status,
            });

            console.log('Payment created:', newPayment); // Лог створеного платежу
            return res.status(201).json(newPayment);
        } catch (error) {
            console.error('Error in createPayment:', error.message);
            next(ApiError.internalError('Failed to create payment'));
        }
    }

    // Отримання всіх платежів для клієнта
    async getAllPaymentsForClient(req, res, next) {
        try {
            const { clientId } = req.params;

            console.log('Fetching payments for client ID:', clientId);

            const payments = await Payment.findAll({ where: { client_id: clientId } });

            if (!payments.length) {
                console.log('No payments found for this client');
                return next(ApiError.badRequest('No payments found for this client'));
            }

            return res.status(200).json(payments);
        } catch (error) {
            console.error('Error in getAllPaymentsForClient:', error.message);
            next(ApiError.internalError('Failed to fetch payments for client'));
        }
    }

    // Отримання всіх платежів для конкретного автомобіля по VIN
    async getAllPaymentsPerVIN(req, res, next) {
        try {
            const { vin } = req.params;

            console.log('Fetching payments for vehicle with VIN:', vin);

            const payments = await Payment.findAll({
                include: [
                    {
                        model: Vehicle,
                        where: { vin },
                    },
                ],
            });

            if (!payments.length) {
                console.log('No payments found for this vehicle');
                return next(ApiError.badRequest('No payments found for this vehicle'));
            }

            return res.status(200).json(payments);
        } catch (error) {
            console.error('Error in getAllPaymentsPerVIN:', error.message);
            next(ApiError.internalError('Failed to fetch payments for vehicle'));
        }
    }
}

const paymentsController = new PaymentsController();
export default paymentsController;
