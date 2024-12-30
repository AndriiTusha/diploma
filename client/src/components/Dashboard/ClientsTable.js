/* eslint-disable */
import React, { useEffect, useState } from 'react';

const ClientsTable = () => {
    const [clients, setClients] = useState([]);

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/clients', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                const data = await response.json();
                setClients(data);
            } catch (err) {
                console.error('Failed to fetch clients:', err);
            }
        };

        fetchClients();
    }, []);

    return (
        <div>
            <h3>Клієнти</h3>
            <table className="table table-bordered">
                <thead>
                <tr className="text-center align-text-top">
                    <th>Ім'я</th>
                    <th>По батькові</th>
                    <th>Прізвище</th>
                    <th>Контактний email</th>
                    <th>Контактний телефон</th>
                    <th>Історія обслуговувань</th>
                    <th>Налаштування нагадувань</th>
                </tr>
                </thead>
                <tbody>
                {clients.map((client) => (
                    <tr key={client.id}>
                        <td>{client.name}</td>
                        <td>{client.contact_info}</td>
                        <td>{client.service_history}</td>
                        <td>{JSON.stringify(client.reminders)}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default ClientsTable;
