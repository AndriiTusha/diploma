import jwt from 'jsonwebtoken';
import ApiError from '../error/ApiError.js';

export const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return next(ApiError.badRequest('No token provided'));
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.SECRET_KEY, {}, (err, decoded) => {
        if (err) {
            return next(ApiError.badRequest('Invalid token'));
        }
        req.user = decoded; // Зберігаємо розшифровані дані у req.user
        next();
    });
};
