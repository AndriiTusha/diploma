import express from "express";
import sequelize from "./db.js";
import models from "./models/models.js";
import fileUpload from 'express-fileupload';
import cors from "cors";
import router from "./routes/mainRouter.js";
import errorHandler from "./middleware/ErrorHandlingMiddleware.js";
import path from "path";
import {fileURLToPath} from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { initializeDefaultUsers } from './utils/initializeUsers.js';

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.resolve(__dirname, 'uploads')));
app.use(fileUpload({}));
app.use('/api', router);

// Додаємо middleware для роздачі статичних файлів
app.use(express.static(path.join(__dirname, 'client', 'build')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

app.use(errorHandler)

app.get("/", (req, res) =>
{res.status(200).json({message:"Server Working!!!"})})

// Проверка подключения к Supabase
// app.get('/api/users', async (req, res) => {
//     try {
//         const { data, error } = await supabase.from('users').select('*');
//         if (error) throw error;
//         res.status(200).json(data);
//     } catch (err) {
//         res.status(500).json({ message: 'Ошибка подключения к базе данных', error: err.message });
//     }
// });

const start = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        // Додавання адміністратора та співробітника
        await initializeDefaultUsers();
        app.listen(PORT, () => console.log("server started on port: " + PORT));
    } catch (e) {
        console.log(e);
    }
};

start()
