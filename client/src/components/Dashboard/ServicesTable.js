import React from 'react';
import { Table } from 'react-bootstrap';

const ServicesTable = ({ services = [] }) => {
    return (
        <div className="services-table">
            <h3>Історія Діагностики та Ремонтів</h3>
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>#</th>
                    <th>Дата і час</th>
                    <th>Тип послуги</th>
                    <th>Стан виконання</th>
                </tr>
                </thead>
                <tbody>
                {services.map((service, index) => (
                    <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{service.dateTime}</td>
                        <td>{service.service_Type}</td>
                        <td>{service.status}</td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </div>
    );
};

export default ServicesTable;
