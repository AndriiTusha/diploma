/* eslint-disable */
import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom"; // Імпортуємо useNavigate

const LoginForm = () => {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [isLoginValid, setIsLoginValid] = useState(false);
    const [isPasswordValid, setIsPasswordValid] = useState(false);

    const navigate = useNavigate(); // Хук для навігації

    // Перевірка логіна
    const validateLogin = (value) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setIsLoginValid(emailPattern.test(value));
        setLogin(value);
    };

    // Перевірка пароля
    const validatePassword = (value) => {
        const passwordPattern = /^[A-Za-z0-9][A-Za-z0-9!@#$%^&*()_+=\-`~<>?,./:;"'[\]{}|]{7,}$/;
        const isValid = passwordPattern.test(value) && !value.includes(" ");
        setIsPasswordValid(isValid);
        setPassword(value);
    };

    // Обробка форми
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: login, password }),
            });

            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.token);
                navigate('/dashboard');
            } else {
                alert(data.message);
            }
        } catch (err) {
            console.error(err);
            alert('Server error');
        }
    };


    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <Form
                className="p-4 border rounded shadow bg-white"
                style={{ width: "100%", maxWidth: "400px" }}
                onSubmit={handleSubmit}
            >
                <h3 className="text-center mb-4">Вхід до системи</h3>

                {/* Логін */}
                <Form.Group className="mb-3">
                    <Form.Label>Логін (E-mail)</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="example@mail.com"
                        value={login}
                        onChange={(e) => validateLogin(e.target.value)}
                        isInvalid={!isLoginValid && login !== ""}
                        isValid={isLoginValid}
                    />
                    <Form.Control.Feedback type="invalid">
                        Введіть коректний e-mail.
                    </Form.Control.Feedback>
                </Form.Group>

                {/* Пароль */}
                <Form.Group className="mb-3">
                    <Form.Label>Пароль</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Введіть пароль"
                        value={password}
                        onChange={(e) => validatePassword(e.target.value)}
                        isInvalid={!isPasswordValid && password !== ""}
                        isValid={isPasswordValid}
                    />
                    <Form.Control.Feedback type="invalid">
                        Пароль має бути не менше 8 символів, без пробілів.
                    </Form.Control.Feedback>
                </Form.Group>

                {/* Кнопка Вхід */}
                <Button
                    type="submit"
                    className="w-100"
                    variant="primary"
                    disabled={!isLoginValid || !isPasswordValid}
                >
                    Вхід до системи
                </Button>

                {/* Посилання */}
                <div className="text-center mt-3">
          <span
              className="text-decoration-none text-primary"
              style={{cursor: "pointer"}}
              onClick={() => navigate("/register")} // Перехід до реєстрації
          >
            Зареєструватися
          </span>{" "}
                    |{" "}
                    <span
                        className="text-decoration-none text-primary"
                        style={{cursor: "pointer"}}
                        onClick={() => navigate("/forgot-password")} // Перехід до нагадування
                    >
                        Нагадати пароль
                    </span>
                </div>
            </Form>
        </div>
);
};

export default LoginForm;
