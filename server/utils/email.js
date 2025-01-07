import nodemailer from 'nodemailer';

// Функція для відправлення email
export const sendVerificationEmail = async (email, code) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.ukr.net', // Замість 'smtp.example.com' вкажіть свій SMTP сервер
        port: 465, // 465 для SSL або 587 для TLS
        secure: true, // true для SSL
        auth: {
            user: process.env.SERVER_EMAIL, // Серверна пошта
            pass: process.env.SERVER_PASS, // Пароль від пошти
        },
    });

    const mailOptions = {
        from: `"AutoService" <${process.env.SERVER_EMAIL}>`,
        to: email, // Email отримувача
        subject: 'Підтвердження реєстрації',
        text: `Ваш код підтвердження: ${code}. Код дійсний протягом 10 хвилин.`,
    };

    await transporter.sendMail(mailOptions);
};
