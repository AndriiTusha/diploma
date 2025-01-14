/* eslint-disable */
import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";

const NewPaymentForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const vehicleId = location.state?.vehicleId; // Отримуємо ID автомобіля
    const [paymentDate, setPaymentDate] = useState("");
    const [amount, setAmount] = useState("");
    const [discountType, setDiscountType] = useState("");
    const [paymentStatus, setPaymentStatus] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!paymentDate || !amount || !vehicleId) {
            setErrorMessage("Усі обов'язкові поля мають бути заповнені!");
            return;
        }

        const paymentData = {
            payment_date: paymentDate,
            amount,
            discount_type: discountType,
            payment_status: paymentStatus,
        };

        try {
            const response = await fetch(`http://localhost:5000/api/payments/createPayment/${vehicleId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(paymentData),
            });

            if (response.ok) {
                alert("Платіж успішно створено!");
                navigate("/dashboard", { state: { activeTab: "payments", vehicleId } });
            } else {
                const data = await response.json();
                setErrorMessage(data.message || "Не вдалося створити платіж.");
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
                <h3 className="text-center mb-4">Створити платіж</h3>

                {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

                <Form.Group className="mb-3">
                    <Form.Label>Дата платежу</Form.Label>
                    <Form.Control
                        type="date"
                        value={paymentDate}
                        onChange={(e) => setPaymentDate(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Сума</Form.Label>
                    <Form.Control
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        min={0}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Тип дисконту</Form.Label>
                    <Form.Select
                        value={discountType}
                        onChange={(e) => setDiscountType(e.target.value)}
                        required
                    >
                        <option value="">Оберіть дисконт</option>
                        <option value="10%">10%</option>
                        <option value="20%">20%</option>
                        <option value="30%">30%</option>
                        <option value="Повна оплата">Повна оплата</option>
                    </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Статус платежу</Form.Label>
                    <Form.Select
                        value={paymentStatus}
                        onChange={(e) => setPaymentStatus(e.target.value)}
                    >
                        <option value="">Оберіть статус</option>
                        <option value="Оплачено">Оплачено</option>
                        <option value="Очікується">Очікується</option>
                    </Form.Select>
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100">
                    Додати платіж
                </Button>
                <Button
                    variant="secondary"
                    className="w-100 my-2"
                    onClick={() => navigate("/dashboard", { state: { activeTab: "payments", vehicleId } })}
                >
                    Повернутися
                </Button>
            </Form>
        </div>
    );
};

export default NewPaymentForm;
