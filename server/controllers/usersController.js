import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import ApiError from '../error/ApiError.js';
import { User } from '../models/models.js';

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

            // Створення нового користувача з роллю Client
            const user = await User.create({
                email,
                password: hashedPassword,
                role: 'Client',
            });

            const token = jwt.sign(
                { id: user.id, email: user.email, role: user.role }, // payload
                process.env.SECRET_KEY, // секретний ключ
                { expiresIn: '24h' } // термін дії
            );


            return res.status(201).json({
                message: 'User registered successfully',
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