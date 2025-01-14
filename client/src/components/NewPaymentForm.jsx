/* eslint-disable */
import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom"; // Додаємо для переходу
import {carLib} from "../libs/carLib.js"

const NewAutoForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [vin, setVin] = useState("");
    const [brand, setBrand] = useState("");
    const [model, setModel] = useState("");
    const [year, setYear] = useState("");
    const [mileage, setMileage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const clientId = location.state?.clientId; // ID клієнта
    const carData = carLib;

    // Масив років випуску
    const years = Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i);

    // Функція обробки відправки форми
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!vin || !brand || !model || !year || !mileage) {
            setErrorMessage("Усі поля обов'язкові для заповнення!");
            return;
        }

        const vehicleData = {
            vin,
            mark: brand,
            model,
            year,
            miles: mileage,
            client_id: clientId, // Додаємо ID клієнта
        };

        // Логіка для відправки даних
        try {
            const response = await fetch("http://localhost:5000/api/vehicles/createVehicle", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`, // Додаємо токен
                },
                body: JSON.stringify(vehicleData),
            });

            if (response.ok) {
                alert("Автомобіль успішно додано!");
                // Переходимо на вкладку "Автомобілі" для конкретного клієнта
                navigate("/dashboard", { state: { activeTab: "vehicles", clientId } });
            } else {
                const data = await response.json();
                setErrorMessage(data.message || "Не вдалося додати автомобіль.");
            }
        } catch (err) {
            setErrorMessage("Сервер недоступний.");
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <Form
                className="p-4 border rounded shadow bg-white"
                style={{ width: "100%", maxWidth: "400px" }}
                onSubmit={handleSubmit}
            >
                <h3 className="text-center mb-4">Додати автомобіль</h3>

                {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

                {/* VIN */}
                <Form.Group className="mb-3">
                    <Form.Label>VIN код</Form.Label>
                    <Form.Control
                        type="text"
                        value={vin}
                        onChange={(e) => setVin(e.target.value)}
                        maxLength={17}
                        isInvalid={vin && !/^[A-HJ-NPR-Z0-9]{11}[0-9]{6}$/.test(vin)}
                        isValid={vin && /^[A-HJ-NPR-Z0-9]{11}[0-9]{6}$/.test(vin)}
                    />
                    <Form.Control.Feedback type="invalid">
                        VIN має складатися з 17 символів, останні 6 з яких — цифри.
                    </Form.Control.Feedback>
                </Form.Group>

                {/* Марка */}
                <Form.Group className="mb-3">
                    <Form.Label>Марка</Form.Label>
                    <Form.Select
                        value={brand}
                        onChange={(e) => {
                            setBrand(e.target.value);
                            setModel(""); // Скидаємо вибір моделі
                        }}
                    >
                        <option value="">Оберіть марку</option>
                        {carData.map((car) => (
                            <option key={car.brand} value={car.brand}>
                                {car.brand}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>

                {/* Модель */}
                <Form.Group className="mb-3">
                    <Form.Label>Модель</Form.Label>
                    <Form.Select
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                        disabled={!brand}
                    >
                        <option value="">Оберіть модель</option>
                        {brand &&
                            carData
                                .find((car) => car.brand === brand)
                                ?.models.map((m) => (
                                <option key={m} value={m}>
                                    {m}
                                </option>
                            ))}
                    </Form.Select>
                </Form.Group>

                {/* Рік випуску */}
                <Form.Group className="mb-3">
                    <Form.Label>Рік випуску</Form.Label>
                    <Form.Select
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                    >
                        <option value="">Оберіть рік</option>
                        {years.map((y) => (
                            <option key={y} value={y}>
                                {y}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>

                {/* Пробіг */}
                <Form.Group className="mb-3">
                    <Form.Label>Пробіг (км)</Form.Label>
                    <Form.Control
                        type="number"
                        value={mileage}
                        onChange={(e) => setMileage(e.target.value)}
                        min={0}
                        step={1}
                    />
                </Form.Group>

                {/* Кнопки */}
                <Button variant="primary" type="submit" className="w-100">
                    Додати автомобіль
                </Button>
                <Button
                    variant="secondary"
                    className="w-100 my-2"
                    onClick={() => navigate("/dashboard")}
                >
                    Повернутися
                </Button>
            </Form>
        </div>
    );
};

export default NewAutoForm;
