import bcrypt from 'bcrypt';
import { User } from '../models/models.js';

export async function initializeDefaultUsers() {
    const defaultUsers = [
        {
            email: process.env.ADMIN_EMAIL,
            password: process.env.ADMIN_PASSWORD,
            role: 'Admin',
        },
        {
            email: process.env.EMPLOYEE_EMAIL,
            password: process.env.EMPLOYEE_PASSWORD,
            role: 'Employee',
        },
    ];

    for (const userData of defaultUsers) {
        const user = await User.findOne({ where: { email: userData.email } });
        if (!user) {
            const hashedPassword = await bcrypt.hash(userData.password, 5);
            await User.create({ email: userData.email, password: hashedPassword, role: userData.role });
        }
    }
}
