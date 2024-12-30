/* eslint-disable */
import React, { useEffect, useState } from 'react';
const VehiclesTable = () => {
    const [vehicles, setVehicles] = useState([]);

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/vehicles', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                const data = await response.json();
                setVehicles(data);
            } catch (err) {
                console.error('Failed to fetch vehicles:', err);
            }
        };

        fetchVehicles();
    }, []);

    return (
        <div>
            <h3>Транспортні засоби</h3>
            <table className="table table-bordered">
                <thead>
                <tr>
                    <th>VIN авто</th>
                    <th>Марка</th>
                    <th>Модель</th>
                    <th>Історія діагностики</th>
                    <th>Історія ремонтів</th>
                    <th>Історія ТО</th>
                </tr>
                </thead>
                <tbody>
                {vehicles.map((vehicle) => (
                    <tr key={vehicle.id}>
                        <td>{vehicle.vin}</td>
                        <td>{vehicle.model}</td>
                        <td>{vehicle.diagnostics_history}</td>
                        <td>{vehicle.repair_history}</td>
                        <td>{vehicle.maintenance_history}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default VehiclesTable;
