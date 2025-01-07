import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import ApiError from '../error/ApiError.js';
import { User } from '../models/models.js';
import { sendVerificationEmail } from '../utils/email.js';
import moment from "moment-timezone";


// Функція генерації 6-значного коду
const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

class UsersController {
    async registration(req, res, next) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return next(ApiError.badRequest('Email and password are required'));
            }

            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                return next(ApiError.badRequest('User with this email already exists'));
            }

            const hashedPassword = await bcrypt.hash(password, 5);

            // Генерація коду підтвердження
            const verificationCode = generateVerificationCode();
            const currentTime = moment().utc();
            const codeExpiry = currentTime.clone().add(10, 'minutes'); // Код дійсний 10 хвилин

            const user = await User.create({
                email,
                password: hashedPassword,
                role: 'Client',
                verification_code: verificationCode,
                code_expiry: codeExpiry.utc().format(), // Зберігаємо в UTC
                createdAt: currentTime.utc().format(), // Зберігаємо в UTC
            });

            const token = jwt.sign(
                { id: user.id, email: user.email, role: user.role }, // payload
                process.env.SECRET_KEY, // секретний ключ
                { expiresIn: '24h' } // термін дії
            );

            // Відправлення email з кодом підтвердження
            try {
                await sendVerificationEmail(email, verificationCode);
            } catch (error) {
                await user.destroy(); // Видаляємо користувача, якщо лист не надіслано
                return next(ApiError.internalError('Failed to send email'));
            }

            return res.status(201).json({
                message: 'User registered successfully',
                token,
            });
        } catch (error) {
            return next(ApiError.internalError(error.message));
        }
    }

    // Підтвердження реєстрації
    async verifyUser(req, res, next) {
        try {
            const { email, verification_code } = req.body;

            // Пошук користувача
            const user = await User.findOne({ where: { email } });
            if (!user) {
                return next(ApiError.badRequest('Користувача не знайдено'));
            }

            // Перевірка, чи вже підтверджено
            if (user.is_verified) {
                return next(ApiError.badRequest('Обліковий запис вже підтверджено'));
            }

            // Перевірка ліміту спроб
            if (user.verification_attempts >= 5) {
                return next(ApiError.badRequest('Перевищено кількість спроб верифікації'));
            }

            const currentTime = moment().utc(); // Поточний час в UTC
            const expiryTime = moment(user.code_expiry).utc(); // Час з бази, у UTC

            if (currentTime.isAfter(expiryTime)) {
                await user.update({ verification_attempts: user.verification_attempts + 1 });
                // Збільшення лічильника
                await user.reload();
                return next(ApiError.badRequest('Код прострочений'));
            }

            if (user.verification_code !== verification_code) {
                await user.update({ verification_attempts: user.verification_attempts + 1 });
                // Збільшення лічильника
                await user.reload();
                return next(ApiError.badRequest('Невірний код'));
            }

            // Очищення полів верифікації та підтвердження
            await user.update({
                verification_code: null,
                code_expiry: null,
                is_verified: true,
                verification_attempts: 0 // Скидання лічильника
            });

            res.status(200).json({ message: 'Обліковий запис успішно підтверджено' });
        } catch (error) {
            next(ApiError.internalError(error.message));
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

            if (!user.is_verified) {
                return next(ApiError.badRequest('Обліковий запис не підтверджено'));
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