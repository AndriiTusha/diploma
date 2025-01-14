import React, { createContext, useState, useEffect } from 'react';

export const ClientsContext = createContext();

export const ClientsProvider = ({ children }) => {
    const [clients, setClients] = useState([]);

    const fetchClients = async (page = 1) => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:5000/api/clients/getAllClients?limit=10&page=${page}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            }); // Актуальний шлях до API
            const data = await response.json();
            setClients(data);
            return data;
        } catch (error) {
            console.error('Помилка отримання клієнтів:', error);
        }
    };

    useEffect(() => {
        fetchClients(); // Завантаження даних при старті
    }, []);

    return (
        <ClientsContext.Provider value={{ clients, setClients, fetchClients }}>
            {children}
        </ClientsContext.Provider>
    );
};

