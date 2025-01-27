/* eslint-disable */
import React, { useContext, useState, useEffect } from 'react';
import { ClientsContext } from "../../context/ClientsContext.js";
import { useNavigate } from 'react-router-dom';
import EditModal from "../EditModal.js";


const ClientsTable = ({ setActiveTab, setSelectedClientId, userRole }) => {
    const { clients, fetchClients  } = useContext(ClientsContext);
    const [currentPage, setCurrentPage] = useState(1); // Стан для поточної сторінки
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();
    const [reminders, setReminders] = useState({}); // Стан для зберігання нагадувань
    const [showModal, setShowModal] = useState(false);
    const [editData, setEditData] = useState({});


    useEffect(() => {
        if (userRole === 'Клієнт') {
            // Якщо роль "Клієнт", не виконуємо пагінацію
            fetchClients().then((response) => {
                setTotalPages(1);
            });
        } else {
            // Для інших ролей виконуємо пагінацію
            fetchClients(currentPage).then((response) => {
                setTotalPages(response.totalPages);
            });
        }
    }, [currentPage]);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleCheckboxChange = async (clientId, checked) => {
        setReminders((prev) => ({
            ...prev,
            [clientId]: { ...prev[clientId], remind: checked },
        }));

        if (!checked) {
            try {
                const response = await fetch(`http://localhost:5000/api/clients/removeReminder/${clientId}`, {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                if (response.ok) {
                    alert("Нагадування успішно видалено");
                } else {
                    alert("Не вдалося видалити нагадування");
                }
            } catch (error) {
                console.error("Помилка видалення нагадування:", error);
            }
        }
    };

    const handleReminderSave = async (clientId) => {
        const reminderData = reminders[clientId];

        if (!reminderData.text || !reminderData.date) return; // Перевірка на заповнення

        try {
            const response = await fetch(`http://localhost:5000/api/clients/setReminder/${clientId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(reminderData),
            });

            if (response.ok) {
                alert("Нагадування успішно збережено");
            } else {
                alert("Не вдалося зберегти нагадування");
            }
        } catch (error) {
            console.error("Помилка збереження нагадування:", error);
        }
    };

    const handleFieldChange = (clientId, field, value) => {
        setReminders((prev) => ({
            ...prev,
            [clientId]: { ...prev[clientId], [field]: value },
        }));
    };

    const handleDelete = async (clientId) => {
        if (window.confirm("Ви впевнені, що хочете видалити цього клієнта разом із пов'язаними даними?")) {
            try {
                const response = await fetch(`http://localhost:5000/api/clients/deleteClient/${clientId}`, {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });

                if (response.ok) {
                    alert("Клієнта успішно видалено");
                    fetchClients(); // Оновлюємо список клієнтів після видалення
                } else {
                    const data = await response.json();
                    alert(data.message || "Не вдалося видалити клієнта");
                }
            } catch (error) {
                console.error("Помилка видалення клієнта:", error);
                alert("Не вдалося видалити клієнта");
            }
        }
    };

    const openEditModal = (rowData) => {
        setEditData(rowData); // Заповнюємо модальне вікно даними рядка
        setShowModal(true); // Відкриваємо модальне вікно
    };

    const closeEditModal = () => {
        setShowModal(false);
        setEditData({});
    };

    const saveChanges = async () => {
        try {
            const response = await fetch(
                `http://localhost:5000/api/clients/editClient/${editData.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify(editData),
                }
            );

            if (response.ok) {
                alert("Дані успішно оновлено");
                closeEditModal();
                await fetchClients(); // Оновлюємо дані таблиці
            } else {
                alert("Не вдалося оновити дані");
            }
        } catch (error) {
            console.error("Помилка збереження даних:", error);
        }
    };


    return (
        <div>
            <h3>Клієнти</h3>
            <table className="table table-bordered">
                <thead>
                <tr>
                    <th>Видалити</th>
                    <th>Редагувати</th>
                    <th>#</th>
                    <th>Ім'я</th>
                    <th>По-батькові</th>
                    <th>Прізвище</th>
                    <th>Email</th>
                    <th>Телефон</th>
                    <th>Зв'язаний транспорт</th>
                    <th>Нагадування</th>
                </tr>
                </thead>
                <tbody>
                {Array.isArray(clients?.data) ? (
                    clients.data.length > 0 ? (
                        clients.data.map((client, index) => (
                            <tr key={client.id}>
                                <td className="text-center align-middle">
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleDelete(client.id)}
                                    >
                                        Х
                                    </button>
                                </td>
                                <td className="text-center align-middle">
                                    <button
                                        className="btn btn-warning btn-sm"
                                        onClick={() => openEditModal(client)}
                                    >
                                        &#9998;
                                    </button>
                                </td>
                                <td>{index + 1}</td>
                                <td>{client.name || 'Не вказано'}</td>
                                <td>{client.middle_name || 'Не вказано'}</td>
                                <td>{client.surname || 'Не вказано'}</td>
                                <td>{client.contact_email || 'Не вказано'}</td>
                                <td>{client.contact_phone || 'Не вказано'}</td>
                                <td className="text-center align-middle">
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
                                <td className="d-flex flex-column gap-1">
                                    <input
                                        type="checkbox"
                                        checked={reminders[client.id]?.remind || false}
                                        onChange={(e) => handleCheckboxChange(client.id, e.target.checked)}
                                    />
                                    {reminders[client.id]?.remind && (
                                        <>
                                            <input
                                                type="date"
                                                value={reminders[client.id]?.date || ""}
                                                onChange={(e) => handleFieldChange(client.id, "date", e.target.value)}
                                            />
                                            <textarea
                                                placeholder="Текст нагадування"
                                                value={reminders[client.id]?.text || ""}
                                                onChange={(e) => handleFieldChange(client.id, "text", e.target.value)}
                                                onBlur={() => handleReminderSave(client.id)} // Збереження після втрати фокусу
                                            />
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8" className="text-center">Немає даних</td>
                        </tr>
                    )
                ) : clients ? (
                    <tr>
                        <td>1</td>
                        <td>{clients.name || 'Не вказано'}</td>
                        <td>{clients.middle_name || 'Не вказано'}</td>
                        <td>{clients.surname || 'Не вказано'}</td>
                        <td>{clients.contact_email || 'Не вказано'}</td>
                        <td>{clients.contact_phone || 'Не вказано'}</td>
                        <td className="text-center align-middle">
                            <button
                                className="btn btn-primary btn-sm m-1"
                                onClick={() => {
                                    setSelectedClientId(clients.id);
                                    setActiveTab('vehicles');
                                }}
                            >
                                Транспорт
                            </button>
                        </td>
                    </tr>
                ) : (
                    <tr>
                        <td colSpan="8" className="text-center">Немає даних</td>
                    </tr>
                )}

                </tbody>
            </table>
            {/* Відображення пагінації лише для адміністраторів та співробітників */}
            {userRole !== 'Клієнт' && (
                <div className="d-flex justify-content-center mt-3">
                    <button
                        className="btn btn-secondary btn-sm mx-1"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Попередня
                    </button>
                    <span>Сторінка {currentPage} з {totalPages}</span>
                    <button
                        className="btn btn-secondary btn-sm mx-1"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        Наступна
                    </button>
                </div>
            )}
            <EditModal
                show={showModal}
                onClose={() => setShowModal(false)}
                onSave={saveChanges}
                data={editData}
                onChange={setEditData}
                fields={[
                    { name: "name", label: "Ім'я" },
                    { name: "middle_name", label: "По батькові" },
                    { name: "surname", label: "Прізвище" },
                    { name: "contact_email", label: "Email", type: "email" },
                    { name: "contact_phone", label: "Телефон", type: "phone" },

                ]}
            />
        </div>
    );
};

export default ClientsTable;
