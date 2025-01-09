import React, { useContext, useState } from 'react';
import { ClientsContext } from "../../context/ClientsContext.js";
import { useNavigate } from 'react-router-dom';


const ClientsTable = ({ setActiveTab, setSelectedClientId }) => {
    const { clients } = useContext(ClientsContext);
    const navigate = useNavigate();
    console.log('Clients data from ClientsTable: ', clients);
    const [reminders, setReminders] = useState({}); // Стан для зберігання нагадувань

    const handleCheckboxChange = (clientId) => {
        setReminders((prev) => ({
            ...prev,
            [clientId]: {
                ...prev[clientId],
                remind: !prev[clientId]?.remind, // Змінюємо статус нагадування
            },
        }));
    };

    const handleDateChange = (clientId, date) => {
        setReminders((prev) => ({
            ...prev,
            [clientId]: {
                ...prev[clientId],
                date,
            },
        }));
    };

    const handleDetailsChange = (clientId, details) => {
        setReminders((prev) => ({
            ...prev,
            [clientId]: {
                ...prev[clientId],
                details,
            },
        }));
    };

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
                    <th>Зв'язаний транспорт</th>
                    {/*<th>Платіжна історія</th>*/}
                    <th>Фото авто</th>
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
                            <td>
                                <button
                                    className="btn btn-primary btn-sm m-1"
                                    onClick={() => {
                                        setSelectedClientId(client.id);
                                        setActiveTab('vehicles');
                                    }}
                                >
                                    Транспорт
                                </button>
                            </td>
                            {/*<td>*/}
                            {/*    <button*/}
                            {/*        className="btn btn-success btn-sm m-1"*/}
                            {/*        onClick={() => {*/}
                            {/*            setSelectedClientId(client.id);*/}
                            {/*            setActiveTab('payments');*/}
                            {/*        }}*/}
                            {/*    >*/}
                            {/*        Платежі*/}
                            {/*    </button>*/}
                            {/*</td>*/}
                            <td>
                                <button
                                className="btn btn-warning btn-sm m-1"
                                onClick={() => {
                                    console.log('Here will be file upload feature')
                                }}
                            >
                                Додати фото
                            </button>
                            </td>
                            <td>
                                {/* Чекбокс "Нагадати" */}
                                <div>
                                    <input
                                        type="checkbox"
                                        checked={reminders[client.id]?.remind || false}
                                        onChange={() => handleCheckboxChange(client.id)}
                                    />
                                    <label style={{ marginLeft: '8px' }}>Нагадати</label>
                                </div>

                                {/* Поле "На дату" */}
                                {reminders[client.id]?.remind && (
                                    <div style={{ marginTop: '8px' }}>
                                        <input
                                            type="date"
                                            value={reminders[client.id]?.date || ''}
                                            onChange={(e) =>
                                                handleDateChange(client.id, e.target.value)
                                            }
                                        />
                                    </div>
                                )}

                                {/* Поле "Деталі" */}
                                {reminders[client.id]?.remind && (
                                    <div style={{ marginTop: '8px' }}>
                                        <input
                                            type="text"
                                            placeholder="Деталі"
                                            value={reminders[client.id]?.details || ''}
                                            onChange={(e) =>
                                                handleDetailsChange(client.id, e.target.value)
                                            }
                                        />
                                    </div>
                                )}
                            </td>
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
