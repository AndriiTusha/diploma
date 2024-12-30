import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom"; // Додаємо для переходу

const ForgotPasswordForm = () => {
    const [email, setEmail] = useState("");
    const [vin, setVin] = useState("");
    const [isEmailValid, setIsEmailValid] = useState(false);
    const [isVinValid, setIsVinValid] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate(); // Хук для навігації

    // Валідація email
    const validateEmail = (value) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = emailPattern.test(value);
        setIsEmailValid(isValid);
        setEmail(value);
    };

    // Валідація VIN коду
    const validateVin = (value) => {
        const vinPattern = /^[A-HJ-NPR-Z0-9]{11}[0-9]{6}$/; // 17 символів, останні 6 — цифри
        const isValid = vinPattern.test(value);
        setIsVinValid(isValid);
        setVin(value);
    };

    // Обробка форми
    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEmailValid && isVinValid) {
            alert("Пароль надіслано на ваш email!");
        } else {
            setErrorMessage("Перевірте введені дані.");
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <Form
                className="p-4 border rounded shadow bg-white"
                style={{ width: "100%", maxWidth: "400px" }}
                onSubmit={handleSubmit}
            >
                <h3 className="text-center mb-4">Нагадування пароля</h3>

                {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

                {/* Поле для вводу email */}
                <Form.Group className="mb-3">
                    <Form.Label>Ваш e-mail</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="example@mail.com"
                        value={email}
                        onChange={(e) => validateEmail(e.target.value)}
                        isInvalid={!isEmailValid && email !== ""}
                        isValid={isEmailValid}
                    />
                    <Form.Control.Feedback type="invalid">
                        Введіть коректний e-mail.
                    </Form.Control.Feedback>
                </Form.Group>

                {/* Поле для вводу VIN */}
                <Form.Group className="mb-3">
                    <Form.Label>VIN код автомобіля</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Введіть VIN код"
                        value={vin}
                        onChange={(e) => validateVin(e.target.value)}
                        isInvalid={!isVinValid && vin !== ""}
                        isValid={isVinValid}
                    />
                    <Form.Control.Feedback type="invalid">
                        VIN має містити 17 символів, останні 6 з яких — цифри.
                    </Form.Control.Feedback>
                </Form.Group>

                {/* Кнопка отримання пароля */}
                <Button
                    type="submit"
                    className="w-100"
                    variant="primary"
                    disabled={!isEmailValid || !isVinValid}
                >
                    Отримати пароль
                </Button>
                <Button
                    variant="secondary"
                    className="w-100 my-2"
                    onClick={() => navigate("/login")}
                >
                    Повернутися
                </Button>
            </Form>
        </div>
    );
};

export default ForgotPasswordForm;
