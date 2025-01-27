/* eslint-disable */
import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom"; // Додаємо для переходу

const ForgotPasswordForm = () => {
    const [email, setEmail] = useState("");
    const [isEmailValid, setIsEmailValid] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate(); // Хук для навігації

    // Валідація email
    const validateEmail = (value) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = emailPattern.test(value);
        setIsEmailValid(isValid);
        setEmail(value);
    };

    // Обробка форми
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/users/remind-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();
            if (response.ok) {
                alert('Новий пароль надіслано на вашу електронну пошту!');
                navigate("/"); // Перехід на головну сторінку
            } else {
                setErrorMessage(data.message || 'Помилка нагадування пароля.');
            }
        } catch (error) {
            setErrorMessage('Сервер недоступний. Спробуйте пізніше.');
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

                {/* Кнопка отримання пароля */}
                <Button
                    type="submit"
                    className="w-100"
                    variant="primary"
                    disabled={!isEmailValid}
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
