import {Sequelize} from "sequelize";
// import { createClient } from '@supabase/supabase-js';
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        dialect: process.env.DB_DIALECT,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialectOptions: {
            ssl: {
                require: true,  // Обов'язковий SSL
                rejectUnauthorized: false  // Ігноруємо невідомі сертифікати
            }
        },
        logging: false,  // Вимкнення логування SQL-запитів
    }
)

// const sequelize = new Sequelize(
//     process.env.DB_NAME,
//     process.env.DB_USER,
//     process.env.DB_PASSWORD,
//     {
//     host: process.env.DB_HOST,
//     dialect: 'postgresql'
//     }
// );

// const sequelize = new Sequelize(
//     process.env.DB_URL,
//     {
//     dialect: process.env.DB_DIALECT,
//     dialectOptions: {
//         ssl: {
//             require: true,
//             rejectUnauthorized: false
//         }
//     },
//     logging: false
// });

// Подключение через Supabase Client (для работы с API Supabase)
//const supabase = createClient(process.env.DB_HOST, process.env.SUPABASE_KEY);

const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Успешное подключение к Supabase через Sequelize');
    } catch (error) {
        console.error('❌ Ошибка подключения к базе:', error);
    }
};

testConnection();

export default sequelize;