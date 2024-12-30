import React from 'react';
import { Table } from 'react-bootstrap';

const PaymentsTable = ({ payments = []}) => {
    return (
        <div className="payments-table">
            <h3>Історія Платежів та Знижок</h3>
            <Table striped bordered hover>
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
                {payments.map((payment, index) => (
                    <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{payment.date}</td>
                        <td>{payment.amount}</td>
                        <td>{payment.discountType}</td>
                        <td>{payment.status}</td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </div>
    );
};

export default PaymentsTable;
