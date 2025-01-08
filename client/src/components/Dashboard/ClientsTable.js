import React, { useContext } from 'react';
import { ClientsContext } from "../../context/ClientsContext.js";

const ClientsTable = () => {
    const { clients } = useContext(ClientsContext);
    console.log('Clients data from ClientsTable: ', clients)

    return (
        <div>
            <h3>Клієнти</h3>
            <table className="table table-bordered">
                <thead>
                <tr>
                    <th>#</th>
                    <th>Ім'я</th>
                    <th>По-батькові</th>
                    <th>Прізвище</th>
                    <th>Email</th>
                    <th>Телефон</th>
                    <th>Сервісна історія</th>
                    <th>Нагадування</th>
                </tr>
                </thead>
                <tbody>
                {clients.data.length > 0 ? (
                    clients.data.map((client, index) => (
                        <tr key={client.id}>
                            <td>{index + 1}</td>
                            <td>{client.name || 'Не вказано'}</td>
                            <td>{client.middle_name || 'Не вказано'}</td>
                            <td>{client.surname || 'Не вказано'}</td>
                            <td>{client.contact_email || 'Не вказано'}</td>
                            <td>{client.contact_phone || 'Не вказано'}</td>
                            <td>{client.service_history || 'Не вказано'}</td>
                            <td>{ JSON.stringify(client.reminders) || 'Не вказано'}</td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="5" className="text-center">Немає даних</td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
};

export default ClientsTable;
