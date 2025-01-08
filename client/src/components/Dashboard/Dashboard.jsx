import React, { useState } from 'react';
import Sidebar from './Sidebar';
import ClientsTable from './ClientsTable';
import VehiclesTable from './VehiclesTable';
import ServicesTable from './ServicesTable';
import PaymentsTable from './PaymentsTable';


const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('clients'); // Активна вкладка

    // useEffect(() => {
    //     const fetchClients = async () => {
    //         try {
    //             const token = localStorage.getItem('token');
    //             const response = await fetch('http://localhost:5000/api/clients/getAllClients', {
    //                 method: 'GET',
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                     Authorization: `Bearer ${token}`,
    //                 },
    //             });
    //
    //             if (response.ok) {
    //                 const data = await response.json();
    //                 setClients(data); // Зберігаємо клієнтів у контексті
    //             } else {
    //                 console.error('Не вдалося завантажити клієнтів');
    //             }
    //         } catch (err) {
    //             console.error('Помилка сервера:', err);
    //         }
    //     };
    //
    //     fetchClients();
    // }, [setClients]);

    const renderContent = () => {
        switch (activeTab) {
            case 'clients':
                return <ClientsTable />;
            case 'vehicles':
                return <VehiclesTable />;
            case 'services':
                return <ServicesTable />;
            case 'payments':
                return <PaymentsTable />;
            default:
                return <ClientsTable />;
        }
    };

    return (
        <div className="d-flex vh-100">
            <Sidebar setActiveTab={setActiveTab} activeTab={activeTab} />
            <div className="flex-grow-1 p-4">{renderContent()}</div>
        </div>
    );
};

export default Dashboard;
