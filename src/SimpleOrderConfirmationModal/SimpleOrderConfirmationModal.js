import React from 'react';
import './SimpleOrderConfirmationModal.css';

const SimpleOrderConfirmationModal = ({ isOpen, onClose, orderDetails }) => {
  if (!isOpen) return null;

  return (
    <div className="order-modal-overlay">
      <div className="order-modal-content">
        <h2 className="order-modal-title">Order Confirmed!</h2>
        <p className="order-modal-message">Your order has been successfully placed and is being prepared.</p>
        {orderDetails.length > 0 && (
          <div className="order-details">
            <p>Order Details:</p>
            <ul className="order-details-list">
              {orderDetails.map((item, index) => (
                <li key={index} className="order-details-item">{item}</li>
              ))}
            </ul>
          </div>
        )}
        <button 
          onClick={onClose}
          className="order-close-button"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default SimpleOrderConfirmationModal;