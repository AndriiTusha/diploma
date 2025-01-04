import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import ApiError from '../error/ApiError.js';
import { User } from '../models/models.js';

class UsersController {
    async registration(req, res, next) {
        try {
            const {
                email,
                password,
                name,
                middle_name,
                surname,
                contact_email,
                contact_phone,
                service_history = null,
                reminders = null,
            } = req.body;

            // Перевірка обов'язкових полів
            if (!email || !password || !name || !surname || !contact_email || !contact_phone) {
                return next(ApiError.badRequest('All required fields must be filled'));
            }

            // Перевірка унікальності email і телефону
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                return next(ApiError.badRequest('User with this email already exists'));
            }

            const existingClient = await Client.findOne({ where: { contact_email } });
            if (existingClient) {
                return next(ApiError.badRequest('Client with this contact email already exists'));
            }

            const existingPhone = await Client.findOne({ where: { contact_phone } });
            if (existingPhone) {
                return next(ApiError.badRequest('Client with this contact phone already exists'));
            }

            // Хешування пароля
            const hashedPassword = await bcrypt.hash(password, 5);

            // Створення користувача
            const user = await User.create({
                email,
                password: hashedPassword,
                role: 'Client',
            });

            // Створення клієнта
            const client = await Client.create({
                name,
                middle_name,
                surname,
                contact_email,
                contact_phone,
                service_history,
                reminders,
                user_id: user.id, // Зв'язок користувача з клієнтом
            });

            // Генерація токена
            const token = jwt.sign(
                { id: user.id, email: user.email, role: user.role },
                process.env.SECRET_KEY,
                { expiresIn: '24h' }
            );

            // Повернення токена
            return res.status(201).json({
                message: 'Client registered successfully',
                token,
            });
        } catch (error) {
            return next(ApiError.internalError(error.message));
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return next(ApiError.badRequest('Email and password are required'));
            }

            const user = await User.findOne({ where: { email } });
            if (!user) {
                return next(ApiError.badRequest('User with this email does not exist'));
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return next(ApiError.badRequest('Invalid password'));
            }

            const token = jwt.sign(
                { id: user.id, email: user.email, role: user.role },
                process.env.SECRET_KEY,
                { expiresIn: '24h' }
            );

            return res.json({ token });
        } catch (error) {
            return next(ApiError.internalError(error.message));
        }
    }

    async check(req, res, next) {
        try {
            const token = jwt.sign(
                { id: req.user.id, email: req.user.email, role: req.user.role },
                process.env.SECRET_KEY,
                { expiresIn: '24h' }
            );
            return res.json({ token });
        } catch (error) {
            return next(ApiError.internalError(error.message));
        }
    }

}

const usersController = new UsersController();
export default usersController;