import nodemailer from 'nodemailer';

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
