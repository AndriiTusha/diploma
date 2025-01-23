import {Sequelize} from "sequelize";
import dotenv from "dotenv";
dotenv.config();

// console.log("DB_PASSWORD:", process.env.DB_PASSWORD);

const sequelize = new Sequelize(
    // process.env.DB_NAME,
    // process.env.DB_USER,
    // process.env.DB_PASSWORD,
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    {
        dialect: "postgres",
        // host: process.env.DB_HOST,
        // port: process.env.DB_PORT,
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        }
    }
)

export default sequelize;