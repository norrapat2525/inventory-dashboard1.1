import React from 'react';

const ProductTable = () => {
  return React.createElement('div', {
    style: {
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }
  }, [
    React.createElement('h1', { key: 'title' }, 'Product List - Ultra Simple'),
    React.createElement('p', { key: 'desc' }, 'This component works without any external dependencies!'),
    React.createElement('div', { 
      key: 'button',
      style: {
        backgroundColor: '#1976d2',
        color: 'white',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        display: 'inline-block',
        marginTop: '10px'
      }
    }, 'Test Button - Working!')
  ]);
};

export default ProductTable;