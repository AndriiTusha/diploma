import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

// Модель користувачів
export const User = sequelize.define('user', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.STRING, defaultValue: 'Client' },
});

// Модель клієнтів
export const Client = sequelize.define('client', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    middle_name: { type: DataTypes.STRING, allowNull: false },
    surname: { type: DataTypes.STRING, allowNull: false },
    contact_email: { type: DataTypes.STRING, unique: true, allowNull: false },
    contact_phone: { type: DataTypes.STRING, unique: true, allowNull: false },
    service_history: { type: DataTypes.TEXT },
    reminders: { type: DataTypes.JSON },
});

// Модель транспортних засобів
export const Vehicle = sequelize.define('vehicle', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    vin: { type: DataTypes.STRING, unique: true, allowNull: false },
    mark: { type: DataTypes.STRING, allowNull: false },
    model: { type: DataTypes.STRING, allowNull: false },
    year: {type: DataTypes.INTEGER, allowNull: false},
    miles: {type: DataTypes.INTEGER, allowNull: false},
    diagnostics_history: { type: DataTypes.TEXT },
    repair_history: { type: DataTypes.TEXT },
    maintenance_history: { type: DataTypes.TEXT },
    client_id: { // Додаємо явно зовнішній ключ
        type: DataTypes.INTEGER,
        allowNull: false, // Клієнт обов'язковий для авто
        references: {
            model: 'clients', // Назва таблиці
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
    },
});

// Модель діагностики
export const DiagnosticsRecord = sequelize.define('diagnostics_record', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    appointment_datetime: { type: DataTypes.DATE, allowNull: false },
    description: { type: DataTypes.TEXT },
});

// Модель ремонту
export const RepairRecord = sequelize.define('repair_record', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    appointment_datetime: { type: DataTypes.DATE, allowNull: false },
    repair_description: { type: DataTypes.TEXT },
});

// Модель технічного обслуговування
export const MaintenanceRecord = sequelize.define('maintenance_record', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    appointment_datetime: { type: DataTypes.DATE, allowNull: false },
    maintenance_description: { type: DataTypes.TEXT },
});

// Модель платежів
export const Payment = sequelize.define('payment', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    payment_date: { type: DataTypes.DATE, allowNull: false },
    amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    discount_type: { type: DataTypes.STRING },
    payment_status: { type: DataTypes.STRING },
    client_id: { // Зв'язок із клієнтом
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'clients',
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
    vehicle_id: { // Зв'язок із автомобілем
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'vehicles',
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
});


/// ----- Визначення зв'язків -----

// Клієнт має багато автомобілів
Client.hasMany(Vehicle, { foreignKey: 'client_id' });
Vehicle.belongsTo(Client, { foreignKey: 'client_id' });

// Клієнт має багато платежів
Client.hasMany(Payment, { foreignKey: 'client_id' });
Payment.belongsTo(Client, { foreignKey: 'client_id' });

// Транспортний засіб пов'язаний із записами діагностики
Vehicle.hasMany(DiagnosticsRecord, { foreignKey: 'vehicle_id' });
DiagnosticsRecord.belongsTo(Vehicle, { foreignKey: 'vehicle_id' });

// Транспортний засіб пов'язаний із записами ремонту
Vehicle.hasMany(RepairRecord, { foreignKey: 'vehicle_id' });
RepairRecord.belongsTo(Vehicle, { foreignKey: 'vehicle_id' });

// Транспортний засіб пов'язаний із записами технічного обслуговування
Vehicle.hasMany(MaintenanceRecord, { foreignKey: 'vehicle_id' });
MaintenanceRecord.belongsTo(Vehicle, { foreignKey: 'vehicle_id' });

// Транспортний засіб має багато платежів
Vehicle.hasMany(Payment, { foreignKey: 'vehicle_id' });
Payment.belongsTo(Vehicle, { foreignKey: 'vehicle_id' });

// Клієнт може мати багато записів по діагностиці, ремонту і технічному обслуговуванню
Client.hasMany(DiagnosticsRecord, { foreignKey: 'client_id' });
DiagnosticsRecord.belongsTo(Client, { foreignKey: 'client_id' });

Client.hasMany(RepairRecord, { foreignKey: 'client_id' });
RepairRecord.belongsTo(Client, { foreignKey: 'client_id' });

Client.hasMany(MaintenanceRecord, { foreignKey: 'client_id' });
MaintenanceRecord.belongsTo(Client, { foreignKey: 'client_id' });

export default {
    User,
    Client,
    Vehicle,
    DiagnosticsRecord,
    RepairRecord,
    MaintenanceRecord,
    Payment,
};
