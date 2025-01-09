/* eslint-disable */
import React, { useEffect, useState } from 'react';
const VehiclesTable = ({clientId, setActiveTab, setSelectedVehicleId }) => {
    const [vehicles, setVehicles] = useState([]);

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/vehicles/getAllVehiclesForClient/${clientId}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                const data = await response.json();
                setVehicles(data);
            } catch (err) {
                console.error('Failed to fetch vehicles:', err);
            }
        };

        if (clientId) fetchVehicles();
    }, [clientId]);

    return (
        <div>
            <h3>Транспортні засоби</h3>
            <table className="table table-bordered">
                <thead>
                <tr>
                    <th>#</th>
                    <th>VIN авто</th>
                    <th>Марка</th>
                    <th>Модель</th>
                    <th>Рік випуску</th>
                    <th>Пробіг, км</th>
                    <th>Історія діагностики</th>
                    <th>Історія ремонтів</th>
                    <th>Історія техобслуговування</th>
                    <th>Пов'язані платежі</th>
                </tr>
                </thead>
                <tbody>
                {vehicles.length > 0 ? (
                    vehicles.map((vehicle, index) => (
                    <tr key={vehicle.id}>
                        <td>{index + 1}</td>
                        <td>{vehicle.vin}</td>
                        <td>{vehicle.mark}</td>
                        <td>{vehicle.model}</td>
                        <td>{vehicle.year}</td>
                        <td>{vehicle.miles}</td>
                        <td>{vehicle.diagnostics_history}</td>
                        <td>{vehicle.repair_history}</td>
                        <td>{vehicle.maintenance_history}</td>
                        <td>
                            <button
                                className="btn btn-success btn-sm m-1"
                                onClick={() => {
                                    setSelectedVehicleId(vehicle.id);
                                    setActiveTab('payments');
                                }}
                            >
                                Платежі
                            </button>
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

export default VehiclesTable;
