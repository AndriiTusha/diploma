/* eslint-disable */
import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom"; // Додаємо для переходу

const NewClientForm = () => {
    const [surname, setSurname] = useState("");
    const [name, setName] = useState("");
    const [patronymic, setPatronymic] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("+38");
    const [errorMessage, setErrorMessage] = useState("");
    const [isPhoneValid, setIsPhoneValid] = useState(false); // Додаємо стан для перевірки номера телефону

    const navigate = useNavigate(); // Хук для навігації
    // Валідація номера телефону
    const validatePhone = (phone) => {
        const phonePattern = /^\+38 \(0[1-9][1-9]\) \d{3}-\d{2}-\d{2}$/;
        return phonePattern.test(phone);
    };

    // Обробка введення номера телефону
    const handlePhoneChange = (e) => {
        const input = e.target.value;

        // Якщо користувач видаляє все, залишаємо лише "+38"
        if (input === "+3" || input === "+") {
            setPhone("+38");
            setIsPhoneValid(false);
            return;
        }

        // Видаляємо всі символи, крім цифр
        let rawValue = input.replace(/\D/g, "");

        // Переконуємося, що "38" завжди на початку
        if (!rawValue.startsWith("38") && rawValue.length > 2) {
            rawValue = "38" + rawValue.slice(2);
        }

        // Обрізаємо номер до максимально допустимої довжини
        rawValue = rawValue.slice(0, 12); // Максимум "+38 (XXX) XXX-XX-XX"

        // Форматуємо номер
        let formatted = "+38";
        if (rawValue.length > 2) {
            formatted += " (" + rawValue.slice(2, 5); // Код оператора
        }
        if (rawValue.length > 5) {
            formatted += ") " + rawValue.slice(5, 8); // Перші 3 цифри номера
        }
        if (rawValue.length > 8) {
            formatted += "-" + rawValue.slice(8, 10); // Наступні 2 цифри номера
        }
        if (rawValue.length > 10) {
            formatted += "-" + rawValue.slice(10, 12); // Останні 2 цифри номера
        }

        // Оновлюємо стан
        setPhone(formatted);

        // Оновлюємо стан для перевірки валідності номера
        setIsPhoneValid(validatePhone(formatted));
    };

    // Валідація інших полів
    const validateFields = () => {
        const cyrillicPattern = /^[А-ЯІЇЄҐа-яіїєґ'’-]+$/;
        const surnameValid = surname.match(cyrillicPattern);
        const nameValid = name.match(cyrillicPattern);
        const patronymicValid = patronymic.match(cyrillicPattern);
        const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
       // const vinValid = /^[A-HJ-NPR-Z0-9]{11}[0-9]{6}$/.test(vin);

        if (!surnameValid) return "Прізвище має містити тільки кирилицю.";
        if (!nameValid) return "Ім'я має містити тільки кирилицю.";
        if (!patronymicValid) return "По батькові має містити тільки кирилицю.";
        if (!emailValid) return "Введіть коректний email.";
        if (!validatePhone(phone)) return "Введіть коректний номер телефону.";
       // if (!vinValid) return "VIN має складатися з 17 символів, останні 6 з яких — цифри.";

        return "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const error = validateFields();
        if (error) {
            setErrorMessage(error);
        } else {
            setErrorMessage("");
            // Логіка для відправлення даних до бази даних
            const clientData = {
                name,
                middle_name: patronymic,
                surname,
                contact_email: email,
                contact_phone: phone,
            };

            try {
                const response = await fetch("http://localhost:5000/api/clients/createClient", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`, // Додаємо токен
                    },
                    body: JSON.stringify(clientData),
                });

                if (response.ok) {
                    alert("Клієнт успішно створений!");
                    navigate("/dashboard");
                } else {
                    const data = await response.json();
                    setErrorMessage(data.message || "Не вдалося створити клієнта.");
                }
            } catch (err) {
                setErrorMessage("Сервер недоступний.");
            }
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <Form
                className="p-4 border rounded shadow bg-white"
                style={{ width: "100%", maxWidth: "400px" }}
                onSubmit={handleSubmit}
            >
                <h3 className="text-center mb-4">Реєстрація нового клієнта</h3>

                {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

                <Form.Group className="mb-3">
                    <Form.Label>Прізвище</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Введіть прізвище"
                        value={surname}
                        onChange={(e) => setSurname(e.target.value)}
                        maxLength={40}
                        isInvalid={surname && !/^[А-ЯІЇЄҐ][а-яіїєґ']{1,20}(-[А-ЯІЇЄҐ][а-яіїєґ']{1,20})?$/.test(surname)}
                        isValid={surname && /^[А-ЯІЇЄҐ][а-яіїєґ']{1,20}(-[А-ЯІЇЄҐ][а-яіїєґ']{1,20})?$/.test(surname)}
                    />
                    <Form.Control.Feedback type="invalid">
                        Прізвище має містити тільки кирилицю та бути до 40 символів.
                    </Form.Control.Feedback>
                    <Form.Control.Feedback type="valid">
                        <i className="fas fa-check-circle" style={{ color: "green" }}></i>
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Ім'я</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Введіть ім'я"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        maxLength={40}
                        isInvalid={name && !/^[А-ЯІЇЄҐ][а-яіїєґ']{1,20}(-[А-ЯІЇЄҐ][а-яіїєґ']{1,20})?$/.test(name)}
                        isValid={name && /^[А-ЯІЇЄҐ][а-яіїєґ']{1,20}(-[А-ЯІЇЄҐ][а-яіїєґ']{1,20})?$/.test(name)}
                    />
                    <Form.Control.Feedback type="invalid">
                        Ім'я має містити тільки кирилицю та бути коротше 40 літер.
                    </Form.Control.Feedback>
                    <Form.Control.Feedback type="valid">
                        <i className="fas fa-check-circle" style={{ color: "green" }}></i>
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>По батькові</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Введіть по батькові"
                        value={patronymic}
                        onChange={(e) => setPatronymic(e.target.value)}
                        maxLength={40}
                        isInvalid={patronymic && !/^[А-ЯІЇЄҐа-яіїєґ'’-]{1,25}$/.test(patronymic)}
                        isValid={patronymic && /^[А-ЯІЇЄҐа-яіїєґ'’-]{1,25}$/.test(patronymic)}
                    />
                    <Form.Control.Feedback type="invalid">
                        По батькові має містити тільки кирилицю та бути коротше 26 літер.
                    </Form.Control.Feedback>
                    <Form.Control.Feedback type="valid">
                        <i className="fas fa-check-circle" style={{ color: "green" }}></i>
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>E-mail</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="example@mail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        isInvalid={email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)}
                        isValid={email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)}
                    />
                    <Form.Control.Feedback type="invalid">
                        Введіть коректний email.
                    </Form.Control.Feedback>
                    <Form.Control.Feedback type="valid">
                        <i className="fas fa-check-circle" style={{ color: "green" }}></i>
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Мобільний телефон</Form.Label>
                    <Form.Control
                        type="text"
                        value={phone}
                        onChange={handlePhoneChange}
                        isInvalid={phone && !validatePhone(phone)}
                        isValid={phone && validatePhone(phone)}
                    />
                    <Form.Control.Feedback type="invalid">
                        Введіть коректний номер телефону.
                    </Form.Control.Feedback>
                    <Form.Control.Feedback type="valid">
                        <i className="fas fa-check-circle" style={{ color: "green" }}></i>
                    </Form.Control.Feedback>
                </Form.Group>

                {/*<Form.Group className="mb-3">*/}
                {/*    <Form.Label>VIN код</Form.Label>*/}
                {/*    <Form.Control*/}
                {/*        type="text"*/}
                {/*        value={vin}*/}
                {/*        onChange={(e) => setVin(e.target.value)}*/}
                {/*        maxLength={17}*/}
                {/*        isInvalid={vin && !/^[A-HJ-NPR-Z0-9]{11}[0-9]{6}$/.test(vin)}*/}
                {/*        isValid={vin && /^[A-HJ-NPR-Z0-9]{11}[0-9]{6}$/.test(vin)}*/}
                {/*    />*/}
                {/*    <Form.Control.Feedback type="invalid">*/}
                {/*        VIN має складатися з 17 символів, останні 6 з яких — цифри.*/}
                {/*    </Form.Control.Feedback>*/}
                {/*    <Form.Control.Feedback type="valid">*/}
                {/*        <i className="fas fa-check-circle" style={{ color: "green" }}></i>*/}
                {/*    </Form.Control.Feedback>*/}
                {/*</Form.Group>*/}

                <Button variant="primary" type="submit" className="w-100">
                    Зареєструватися
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

export default NewClientForm;
