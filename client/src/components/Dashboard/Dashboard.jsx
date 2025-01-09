import React, { useState } from 'react';
import Sidebar from './Sidebar';
import ClientsTable from './ClientsTable';
import VehiclesTable from './VehiclesTable';
import PaymentsTable from './PaymentsTable';

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('clients'); // Активна вкладка
    const [selectedClientId, setSelectedClientId] = useState(null); // Вибраний клієнт для деталізації
    const [selectedVehicleId, setSelectedVehicleId] = useState(null);

    const renderContent = () => {
        switch (activeTab) {
            case 'clients':
                return <ClientsTable setActiveTab={setActiveTab} setSelectedClientId={setSelectedClientId} />;
            case 'vehicles':
                return <VehiclesTable setActiveTab={setActiveTab} clientId={selectedClientId} setSelectedVehicleId={setSelectedVehicleId}/>;
            case 'payments':
                return <PaymentsTable vehicleId={selectedVehicleId} />;
            default:
                return <ClientsTable setActiveTab={setActiveTab} setSelectedClientId={setSelectedClientId} />;
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
