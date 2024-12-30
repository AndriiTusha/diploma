/* eslint-disable */
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import ClientsTable from './ClientsTable';
import VehiclesTable from './VehiclesTable';
import ServiceRecordsTable from './ServicesTable';
import PaymentsTable from './PaymentsTable';

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('clients'); // Активна вкладка

    const renderContent = () => {
        switch (activeTab) {
            case 'clients':
                return <ClientsTable />;
            case 'vehicles':
                return <VehiclesTable />;
            case 'services':
                return <ServiceRecordsTable />;
            case 'payments':
                return <PaymentsTable />;
            default:
                return <ClientsTable />;
        }
    };

    return (
        <div className="d-flex vh-100">
            <Sidebar setActiveTab={setActiveTab} activeTab={activeTab} />
            <div className="flex-grow-1 p-4">
                {renderContent()}
            </div>
        </div>
    );
};

export default Dashboard;
