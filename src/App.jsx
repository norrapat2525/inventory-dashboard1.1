import React from 'react';
import ProductTable from './components/product/ProductTable';

function App() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f5f5f5',
      padding: '20px'
    }}>
      <h1 style={{ 
        textAlign: 'center', 
        color: '#333',
        marginBottom: '20px'
      }}>
        Inventory Dashboard - Test Mode
      </h1>
      <ProductTable />
    </div>
  );
}

export default App;