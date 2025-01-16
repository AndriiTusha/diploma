import nodemailer from 'nodemailer';
import schedule from 'node-schedule';
import { Client } from '../models/models.js';
import { sendReminderEmail } from './email.js';

export const sendPasswordReminderEmail = async (email, newPassword) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.ukr.net',
        port: 465,
        secure: true,
        auth: {
            user: process.env.SERVER_EMAIL,
            pass: process.env.SERVER_PASS,
        },
    });

    const mailOptions = {
        from: `"AutoService Support Team" <${process.env.SERVER_EMAIL}>`,
        to: email,
        subject: 'Відновлення пароля',
        text: `Ваш новий пароль: ${newPassword}. Рекомендуємо змінити цей пароль після входу в систему.`,
    };

    await transporter.sendMail(mailOptions);
};

export const checkAndSendReminders = async () => {
    try {
        // Отримуємо поточну дату у форматі YYYY-MM-DD
        const today = new Date().toISOString().split('T')[0];

        // Знаходимо клієнтів із нагадуваннями на сьогодні
        const clientsWithReminders = await Client.findAll({
            where: {
                'reminders.remind': true,
                'reminders.date': today,
            },
        });

        for (const client of clientsWithReminders) {
            const { contact_email, reminders } = client;

            // Відправка електронного листа
            await sendReminderEmail(
                contact_email,
                'Нагадування',
                reminders.text
            );

            // Оновлюємо статус нагадування
            client.reminders = null; // Видаляємо нагадування після відправки
            await client.save();
        }

        console.log('Всі нагадування на сьогодні відправлено.');
    } catch (error) {
        console.error('Помилка під час перевірки нагадувань:', error);
    }
};

// Запуск перевірки щодня о 08:00
schedule.scheduleJob('0 8 * * *', checkAndSendReminders);
