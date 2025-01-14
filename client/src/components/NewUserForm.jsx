import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const NewUserForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [verificationCode, setVerificationCode] = useState("");
    const [step, setStep] = useState(1); // Крок: 1 - реєстрація, 2 - верифікація
    const [isLoginValid, setIsLoginValid] = useState(false);
    const [isPasswordValid, setIsPasswordValid] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    // Перевірка логіну
    const validateLogin = (value) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Шаблон для перевірки email
        setIsLoginValid(emailPattern.test(value));
        setEmail(value);
    };

    // Перевірка пароля
    const validatePassword = (value) => {
        const passwordPattern = /^[A-Za-z0-9][A-Za-z0-9!@#$%^&*()_+=\-`~<>?,./:;"'[\]{}|]{7,}$/; // Шаблон для перевірки пароля
        const isValid = passwordPattern.test(value) && !value.includes(" ");
        setIsPasswordValid(isValid);
        setPassword(value);
    };

    // Обробка реєстрації
    const handleRegistration = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        try {
            const response = await fetch("http://localhost:5000/api/users/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (response.ok) {
                alert("Реєстрація успішна! Перевірте свою електронну пошту для отримання коду.");
                setStep(2); // Перехід до введення коду
            } else {
                setErrorMessage(data.message || "Помилка реєстрації.");
            }
        } catch (err) {
            setErrorMessage("Помилка сервера. Спробуйте пізніше.");
        }
    };

    // Обробка верифікації
    const handleVerification = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        try {
            const response = await fetch("http://localhost:5000/api/users/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, verification_code: verificationCode }),
            });

            const data = await response.json();
            if (response.ok) {
                alert("Ваш обліковий запис успішно підтверджено!");
                navigate("/login"); // Перехід до сторінки логіну
            } else {
                setErrorMessage(data.message || "Помилка верифікації.");
            }
        } catch (err) {
            setErrorMessage("Помилка сервера. Спробуйте пізніше.");
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
            {step === 1 && (
                <Form
                    className="p-4 border rounded shadow bg-white"
                    style={{ width: "100%", maxWidth: "400px" }}
                    onSubmit={handleRegistration}
                >
                    <h3 className="text-center mb-4">Реєстрація нового користувача</h3>

                    {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

                    {/* Email */}
                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="example@mail.com"
                            value={email}
                            onChange={(e) => validateLogin(e.target.value)}
                            isInvalid={!isLoginValid && email.length > 0}
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            Введіть коректний email.
                        </Form.Control.Feedback>
                    </Form.Group>

                    {/* Password */}
                    <Form.Group className="mb-3">
                        <Form.Label>Пароль</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Введіть пароль"
                            value={password}
                            onChange={(e) => validatePassword(e.target.value)}
                            isInvalid={!isPasswordValid && password.length > 0}
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            Пароль має містити щонайменше 8 символів, включаючи спеціальні символи, та не мати пробілів.
                        </Form.Control.Feedback>
                    </Form.Group>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        className="w-100"
                        variant="primary"
                        disabled={!isLoginValid || !isPasswordValid}
                    >
                        Зареєструватися
                    </Button>
                    <Button
                        variant="secondary"
                        className="w-100 my-2"
                        onClick={() => navigate("/login")}
                    >
                        Повернутися
                    </Button>
                </Form>
            )}

            {step === 2 && (
                <Form
                    className="p-4 border rounded shadow bg-white"
                    style={{ width: "100%", maxWidth: "400px" }}
                    onSubmit={handleVerification}
                >
                    <h3 className="text-center mb-4">Введіть код верифікації</h3>

                    {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

                    {/* Verification Code */}
                    <Form.Group className="mb-3">
                        <Form.Label>Код верифікації</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Введіть код з електронної пошти"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                            required
                        />
                    </Form.Group>

                    {/* Submit Button */}
                    <Button type="submit" className="w-100" variant="primary">
                        Підтвердити
                    </Button>
                    <Button
                        variant="secondary"
                        className="w-100 my-2"
                        onClick={() => navigate("/login")}
                    >
                        Повернутися
                    </Button>
                </Form>
            )}
        </div>
    );
};

export default NewUserForm;
