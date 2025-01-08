import React, { createContext, useState } from 'react';

export const ClientsContext = createContext();

export const ClientsProvider = ({ children }) => {
    const [clients, setClients] = useState([]);

    return (
        <ClientsContext.Provider value={{ clients, setClients }}>
            {children}
        </ClientsContext.Provider>
    );
};
