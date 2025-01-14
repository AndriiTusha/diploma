import React, {useState, useEffect, useContext} from 'react';
import Sidebar from './Sidebar';
import ClientsTable from './ClientsTable';
import VehiclesTable from './VehiclesTable';
import PaymentsTable from './PaymentsTable';
import {jwtDecode} from "jwt-decode";
import { useNavigate, useLocation } from "react-router-dom";
import {ClientsContext} from "../../context/ClientsContext.js";


const Dashboard = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { fetchClients } = useContext(ClientsContext);
    const initialTab = location.state?.activeTab || "clients";
    const initialClientId = location.state?.clientId || null;
    const [activeTab, setActiveTab] = useState(initialTab); // Активна вкладка
    const [selectedClientId, setSelectedClientId] = useState(initialClientId); // Вибраний клієнт для деталізації
    const [selectedVehicleId, setSelectedVehicleId] = useState(null);
    const [user, setUser] = useState(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded = jwtDecode(token); // Розшифровка токена
                setUser({
                    email: decoded.email || "Не вказано",
                    role:
                        decoded.role === "Admin"
                            ? "Адмін"
                            : decoded.role === "Employee"
                                ? "Співробітник"
                                : "Клієнт",
                });
            } catch (error) {
                console.error("Помилка декодування токена:", error);
            }
        } else {
            navigate('/login');
        }
    }, []);

    // Функція виходу
    const handleLogout = () => {
        localStorage.removeItem("token"); // Видаляємо токен із localStorage
        navigate("/login"); // Перенаправлення на форму логіну
    };

    // Функція обробки натискання кнопки "Створити ..."
    const handleCreateAction = () => {
        switch (activeTab) {
            case 'clients':
                navigate('/new-client'); // Направляє на сторінку створення клієнта
                break;
            case 'vehicles':
                navigate('/new-vehicle', { state: { clientId: selectedClientId } }); // Направляє на сторінку додавання автомобіля
                break;
            case 'payments':
                navigate('/new-payment', { state: { clientId: selectedClientId, vehicleId: selectedVehicleId } }); // Направляє на сторінку створення платежу
                break;
            default:
                console.error('Невідома вкладка!');
        }
    };

    const getCreateButtonText = () => {
        switch (activeTab) {
            case 'clients':
                return 'Створити клієнта';
            case 'vehicles':
                return 'Додати автомобіль';
            case 'payments':
                return 'Створити платіж';
            default:
                return 'Дія';
        }
    };

    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
                await fetchClients();
        } catch (error) {
            console.error('Помилка при оновленні:', error);
        } finally {
            setIsRefreshing(false);
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'clients':
                return <ClientsTable
                    setActiveTab={setActiveTab}
                    setSelectedClientId={setSelectedClientId}
                    userRole={user?.role}
                />;
            case 'vehicles':
                return <VehiclesTable
                    setActiveTab={setActiveTab}
                    clientId={selectedClientId}
                    setSelectedVehicleId={setSelectedVehicleId}
                />;
            case 'payments':
                return <PaymentsTable
                    setActiveTab={setActiveTab}
                    vehicleId={location.state?.vehicleId || selectedVehicleId}
                />;
            default:
                return <ClientsTable
                    setActiveTab={setActiveTab}
                    setSelectedClientId={setSelectedClientId}
                />;
        }
    };

    return (
        <div className="d-flex vh-100">
            <Sidebar setActiveTab={setActiveTab} activeTab={activeTab} />
            <div className="flex-grow-1 p-4">
                {/* Кнопка для створення клієнта */}
                {(user?.role === "Адмін" || user?.role === "Співробітник") && (
                    <div className="mb-3 text-end">
                        <button
                            className="btn btn-success"
                               onClick={ handleCreateAction }
                        >
                            {getCreateButtonText()}
                        </button>
                    </div>
                )}
                {/* Верхній рядок з текстом і кнопкою */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                    {/* Ліва частина: Користувач та роль */}
                    {user && (
                        <div>
                            <strong>Користувач:</strong> {user.email} <br />
                            <strong>Роль:</strong> {user.role}
                        </div>
                    )}
                    {/* Права частина: Кнопка "Вийти" та "Оновити"*/}
                    <button
                        className="btn btn-primary btn-sm me-1"
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                    >
                        {isRefreshing ? 'Оновлення...' : 'Оновити'}
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={handleLogout}>
                        Вийти
                    </button>
                </div>
                {renderContent()}
            </div>
        </div>
    );
};

export default Dashboard;
