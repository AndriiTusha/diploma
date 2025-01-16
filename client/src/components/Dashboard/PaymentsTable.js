import React, { useEffect, useState } from 'react';
import EditModal from "../EditModal.js";

const PaymentsTable = ({ vehicleId }) => {
    const [payments, setPayments] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editData, setEditData] = useState({});

    const fetchPayments = async () => {
        if (!vehicleId) {
            setPayments([]); // Очистити список платежів, якщо vehicleId недійсний
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/payments/getAllPaymentsPerVehicle/${vehicleId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            if (!response.ok) {
                if (response.status === 404) {
                    setPayments([]); // Очистити список, якщо автомобіль видалено
                }
                return;
            }
            const data = await response.json();
            setPayments(data);
        } catch (err) {
            console.error('Failed to fetch vehicles:', err);
        }
    };

    useEffect(() => {
        if (vehicleId) {
            fetchPayments();
        }
    }, [vehicleId]);

    const formatDate = (dateString) => {
        const options = { year: "numeric", month: "2-digit", day: "2-digit" };
        return new Intl.DateTimeFormat("uk-UA", options).format(new Date(dateString));
    };

    const handleDeletePayment = async (paymentId) => {
        if (window.confirm("Ви впевнені, що хочете видалити цей платіж?")) {
            try {
                const response = await fetch(`http://localhost:5000/api/payments/deletePayment/${paymentId}`, {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });

                if (response.ok) {
                    alert("Платіж успішно видалено");
                    fetchPayments(vehicleId); // Оновити список платежів
                } else {
                    const data = await response.json();
                    alert(data.message || "Не вдалося видалити платіж");
                }
            } catch (error) {
                console.error("Помилка видалення платежу:", error);
                alert("Не вдалося видалити платіж");
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
                `http://localhost:5000/api/payments/editPayment/${editData.id}`,
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
                await fetchPayments(editData.id); // Оновлюємо дані таблиці
            } else {
                alert("Не вдалося оновити дані");
            }
        } catch (error) {
            console.error("Помилка збереження даних:", error);
        }
    };


    return (
        <div className="payments-table">
            <h3>Історія Платежів</h3>
            <table className="table table-bordered">
                <thead>
                <tr>
                    <th>Видалити</th>
                    <th>Редагувати</th>
                    <th>#</th>
                    <th>Дата платежу</th>
                    <th>Сума</th>
                    <th>Тип знижки</th>
                    <th>Стан оплати</th>
                </tr>
                </thead>
                <tbody>
                {payments.length > 0 ? (
                    payments.map((payment, index) => (
                    <tr key={index}>
                        <td>
                            <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleDeletePayment(payment.id)}
                            >
                                X
                            </button>

                        </td>
                        <td>
                            <button
                                className="btn btn-warning btn-sm"
                                onClick={() => openEditModal(payment)}
                            >
                                &#9998;
                            </button>
                        </td>
                        <td>{index + 1}</td>
                        <td>{formatDate(payment.payment_date)}</td>
                        <td>{payment.amount}</td>
                        <td>{payment.discount_type}</td>
                        <td>{payment.payment_status}</td>
                    </tr>
                ))
                ) : (
                    <tr>
                        <td colSpan="5" className="text-center">Немає даних</td>
                    </tr>
                )
                }
                </tbody>
            </table>
            <EditModal
                show={showModal}
                onClose={() => setShowModal(false)}
                onSave={saveChanges}
                data={editData}
                onChange={setEditData}
                fields={[
                    { name: "payment_date", label: "Дата платежу", type: "date" },
                    { name: "amount", label: "Сума", type: "number" },
                    {
                        name: "discount_type",
                        label: "Тип дисконту",
                        type: "select",
                        options: [
                            { value: "10%", label: "10%" },
                            { value: "20%", label: "20%" },
                            { value: "30%", label: "30%" },
                            { value: "Повна оплата", label: "Повна оплата" },
                        ],
                    },
                    {
                        name: "payment_status",
                        label: "Стан оплати",
                        type: "select",
                        options: [
                            { value: "Оплачено", label: "Оплачено" },
                            { value: "Очікується", label: "Очікується" },
                        ],
                    },
                ]}
            />
        </div>
    );
};

export default PaymentsTable;
