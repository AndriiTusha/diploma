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

const PORT = process.env.PORT || 5000;
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve(__dirname, "uploads/vehicles")))
app.use(fileUpload({}));
app.use('/api', router);

app.use(errorHandler)

app.get("/", (req, res) =>
{res.status(200).json({message:"Working!!!"})})


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
