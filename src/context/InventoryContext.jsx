import React, { createContext } from 'react';

const InventoryContext = createContext();

export const InventoryProvider = ({ children }) => {
    return (
        <InventoryContext.Provider value={{}}>
            {children}
        </InventoryContext.Provider>
    );
};

export default InventoryContext;