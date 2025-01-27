/* eslint-disable */
import React from 'react';

const Sidebar = ({ setActiveTab, activeTab }) => {
    const tabs = [
        { key: 'clients', label: 'Клієнти' },
        { key: 'vehicles', label: 'Транспорт' },
        // { key: 'services', label: 'Записи' },
        { key: 'payments', label: 'Платежі' },
    ];

    return (
        <div className="bg-dark text-white p-3" style={{ width: '250px' }}>
            <h4 className="mb-4">Меню</h4>
            <ul className="list-unstyled">
                {tabs.map((tab) => (
                    <li
                        key={tab.key}
                        className={`p-2 ${activeTab === tab.key ? 'bg-secondary' : ''}`}
                        style={{ cursor: 'pointer' }}
                        onClick={() => setActiveTab(tab.key)}
                    >
                        {tab.label}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Sidebar;
