/* eslint-disable */
import React, { useEffect, useState } from 'react';
import EditModal from "../EditModal.js";
import { carLib } from "../../libs/carLib.js"; // Масив даних марок і моделей
const years = Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i); // Масив років

const VehiclesTable = ({clientId, setActiveTab, setSelectedVehicleId }) => {
    const [vehicles, setVehicles] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null); // Стан для завантаженого файлу
    const [uploadingVehicleId, setUploadingVehicleId] = useState(null); // Стан для відстеження, до якого авто додається фото
    const [showModal, setShowModal] = useState(false);
    const [editData, setEditData] = useState({});


    const fetchVehicles = async () => {
        if (!clientId) {
            setVehicles([]); // Очистити список авто, якщо clientId недійсний
            return;
        }
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

    useEffect(() => {
        if (clientId) fetchVehicles();
    }, [clientId]);

    const handleFileChange = (e, vehicleId) => {
        setSelectedFile(e.target.files[0]);
        setUploadingVehicleId(vehicleId);
    };

    const handleUpload = async () => {
        if (!selectedFile || !uploadingVehicleId) return;

        const formData = new FormData();
        formData.append('img', selectedFile);

        try {
            const response = await fetch(`http://localhost:5000/api/vehicles/updateVehiclePhoto/${uploadingVehicleId}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: formData,
            });

            const data = await response.json();
            if (response.ok) {
                // Оновлення фото у списку транспортних засобів
                setVehicles((prevVehicles) =>
                    prevVehicles.map((vehicle) =>
                        vehicle.id === uploadingVehicleId ? { ...vehicle, img: data.img } : vehicle
                    )
                );
                setSelectedFile(null);
                setUploadingVehicleId(null);
            } else {
                console.error(data.message);
            }
        } catch (err) {
            console.error('Failed to upload photo:', err);
        }
    };

    const handleDeleteVehicle = async (vehicleId) => {
        if (window.confirm("Ви впевнені, що хочете видалити цей автомобіль разом із пов'язаними платежами?")) {
            try {
                const response = await fetch(`http://localhost:5000/api/vehicles/deleteVehicle/${vehicleId}`, {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });

                if (response.ok) {
                    alert("Автомобіль успішно видалено");
                    setSelectedVehicleId(null); // Очищаємо вибраний автомобіль
                    fetchVehicles(clientId); // Оновлюємо список автомобілів після видалення
                } else {
                    const data = await response.json();
                    console.error("Помилка видалення автомобіля:", data.message);
                    alert(data.message || "Не вдалося видалити автомобіль");
                }
            } catch (error) {
                console.error("Помилка видалення автомобіля:", error);
                alert("Не вдалося видалити автомобіль через помилку сервера");
            }
        }
    };

    const handleEditDataChange = (updatedData) => {
        if (updatedData.mark !== editData.mark) {
            // Якщо марка змінена, скидаємо модель
            updatedData.model = "";
        }
        setEditData(updatedData);
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
                `http://localhost:5000/api/vehicles/editVehicle/${editData.id}`,
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
                await fetchVehicles(editData.id); // Оновлюємо дані таблиці
            } else {
                alert("Не вдалося оновити дані");
            }
        } catch (error) {
            console.error("Помилка збереження даних:", error);
        }
    };

    const handleReadErrors = async (vehicleId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/vehicles/readErrors/${vehicleId}`, {
                method: "GET",
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });

            if (response.ok) {
                const data = await response.json();
                alert("Коди помилок зчитано успішно");
                console.log("Отримані помилки:", data.errors);
            } else {
                const errorData = await response.json();
                alert(errorData.message || "Не вдалося зчитати помилки");
            }
        } catch (error) {
            console.error("Помилка зчитування помилок:", error);
            alert("Сталася помилка при зчитуванні кодів помилок.");
        }
    };



    return (
        <div>
            <h3>Транспортні засоби</h3>
            <table className="table table-bordered">
                <thead>
                <tr>
                    <th>Видалити</th>
                    <th>Редагувати</th>
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
                    <th>Фотографії авто</th>
                    <th>Оберіть файл для завантаження</th>
                </tr>
                </thead>
                <tbody>
                {vehicles.length > 0 ? (
                    vehicles.map((vehicle, index) => (
                    <tr key={vehicle.id}>
                        <td className="text-center align-middle">
                            <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleDeleteVehicle(vehicle.id)}
                            >
                                X
                            </button>
                        </td>
                        <td className="text-center align-middle">
                            <button
                                className="btn btn-warning btn-sm"
                                onClick={() => openEditModal(vehicle)}
                            >
                                &#9998;
                            </button>
                        </td>
                        <td>{index + 1}</td>
                        <td>{vehicle.vin}</td>
                        <td>{vehicle.mark}</td>
                        <td>{vehicle.model}</td>
                        <td>{vehicle.year}</td>
                        <td>{vehicle.miles}</td>
                        <td className="text-center align-middle">
                            <button
                                className="btn btn-info btn-sm"
                                onClick={() => handleReadErrors(vehicle.id)}
                            >
                                &#8634;
                            </button>
                        </td>
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
                        <td>
                            {vehicle.img ? (
                                <img
                                    src={`http://localhost:5000/${vehicle.img}`}
                                    alt="Фото авто"
                                    style={{ width: '100px', height: 'auto' }}
                                />
                            ) : (
                                'Фото відсутнє'
                            )}
                        </td>
                        <td>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileChange(e, vehicle.id)}
                            />
                            <button
                                className="btn btn-primary btn-sm m-1"
                                onClick={handleUpload}
                                disabled={!selectedFile || uploadingVehicleId !== vehicle.id}
                            >
                                Завантажити фото
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
            <EditModal
                show={showModal}
                onClose={() => setShowModal(false)}
                onSave={saveChanges}
                data={editData}
                onChange={handleEditDataChange}
                fields={[
                    { name: "vin", label: "VIN" },
                    {
                        name: "mark",
                        label: "Марка",
                        type: "select",
                        options: carLib.map((car) => ({ value: car.brand, label: car.brand })),
                    },
                    {
                        name: "model",
                        label: "Модель",
                        type: "select",
                        options: (
                            carLib.find((car) => car.brand === editData.mark)?.models || []
                        ).map((model) => ({ value: model, label: model })),
                    },
                    {
                        name: "year",
                        label: "Рік випуску",
                        type: "select",
                        options: years.map((year) => ({ value: year, label: year })),
                    },
                    { name: "miles", label: "Пробіг (км)", type: "number" },
                    { name: "diagnostics_history", label: "Історія діагностики" },
                    { name: "repair_history", label: "Історія ремонтів" },
                    { name: "maintenance_history", label: "Історія техобслуговування" },
                ]}
            />
        </div>
    );
};

export default VehiclesTable;
