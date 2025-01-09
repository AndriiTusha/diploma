import React, { useEffect, useState } from 'react';

const PaymentsTable = ({ vehicleId }) => {
    const [payments, setPayments] = useState([]);

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/payments/getAllPaymentsPerVehicle/${vehicleId}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                const data = await response.json();
                setPayments(data);
            } catch (err) {
                console.error('Failed to fetch vehicles:', err);
            }
        };

        if (vehicleId) fetchVehicles();
    }, [vehicleId]);

    return (
        <div className="payments-table">
            <h3>Історія Платежів</h3>
            <table className="table table-bordered">
                <thead>
                <tr>
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
                        <td>{index + 1}</td>
                        <td>{payment.payment_date}</td>
                        <td>{payment.amount}</td>
                        <td>{payment.discount_type}</td>
                        <td>{payment.status}</td>
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
        </div>
    );
};

export default PaymentsTable;
