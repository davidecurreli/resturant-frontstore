import React, { useState, useEffect } from 'react';
import './OrderHistoryModal.css';

const OrderHistoryModal = ({ isOpen, onClose }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
  const [isActive, setIsActive] = useState(false);

  const token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MjM0MTE2MDEsIm5iZiI6MzQxMDI1MjI2OSwiZXhwIjozNDEwMjU1ODY5LCJhdWQiOiJzZDQ1NHZzZHZzNTM0YnNhIiwiaXNzIjoiaHR0cHM6Ly9yZXN0dXJhbnQtb2F1dGguY29tIiwic3ViIjoiOWI0NmM1NjQtZmEyMy0xMWVkLWFlODUtN2IxNDI4MDBhYjFiIiwianRpIjoiZmZjMzk1YmE4YjI3NmQ1ZDA1YjMxZWI0MWFiMGIzMDk3YmViNTFjMWFmMTZmYmY2M2ViMzExOGZlYjRkOTBlZGVhNWY5ZjA2MzY2ZTYwNDcifQ.FZvKGdDboslbAg2N1rbPMfjDzbQ179gUnyuBqDzsrt8062KVyiv5BkTkzNzmmvoLBYNq734xXRE_zzQn_dLjHrwf6xGbpI-sEthxBR_JAyHdnJfG2MDrNfmtC_BTChUN0BJ-9kK4-1wXAZehrcBuxbxEZRmyllHJIR90Cj_y5hcD4eK5igmhDx1AseMM_unXerqnLTXKAngZOa-c7IJItRIjX5_Umz-y63sex7eIbqKYHKGEz5leUBKjHX6IVdYko5cfX1zfXohnzR6pSXPFyLyd1xFjsnQrEpjREyrdwtrEZtBM9QNWNqcrk1bktwLVBdlDZwt7AJAeEOs_mOuGSg';

  useEffect(() => {
    if (isOpen) {
      fetchOrders();
      setTimeout(() => setIsActive(true), 50);
    } else {
      setIsActive(false);
    }
  }, [isOpen]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const storedUserMail = JSON.parse(localStorage.getItem('user')).email;
      const response = await fetch(`http://localhost:14289/orders/api/order/GetMyOrders/${storedUserMail}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      const data = await response.json();
      setOrders(data.items);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderDetails = async (orderId) => {
    try {
      const response = await fetch(`http://localhost:14289/orders/api/order/GetOrderDetails/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch order details');
      }
      const data = await response.json();
      setSelectedOrderDetails(data);
      setTimeout(() => {
        const detailsModal = document.querySelector('.order-details-modal');
        if (detailsModal) detailsModal.classList.add('active');
      }, 50);
    } catch (err) {
      setError(err.message);
    }
  };

  const closeOrderDetails = () => {
    const detailsModal = document.querySelector('.order-details-modal');
    if (detailsModal) detailsModal.classList.remove('active');
    setTimeout(() => setSelectedOrderDetails(null), 300);
  };

  const handleClose = () => {
    setIsActive(false);
    setTimeout(onClose, 300);
  };

  if (!isOpen) return null;

  return (
    <div className={`history-modal-overlay ${isActive ? 'active' : ''}`}>
      <div className="history-modal-content">
        <h2>Order History</h2>
        <button className="history-close-button" onClick={handleClose}>&times;</button>
        {loading && <p>Loading orders...</p>}
        {error && <p className="error">Error: {error}</p>}
        {!loading && !error && (
          <table className="history-order-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Total Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{new Date(order.orderDate).toLocaleString()}</td>
                  <td>${order.totalAmount.toFixed(2)}</td>
                  <td>{order.status}</td>
                  <td style={{'text-align':'center'}}>
                    <button className="view-details-button" onClick={() => fetchOrderDetails(order.id)}>
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {selectedOrderDetails && (
          <div className="order-details-modal">
            <h3>Order Details</h3>
            <button className="close-details-button" onClick={closeOrderDetails}>&times;</button>
            <h4>Items:</h4>
            <ul>
              {selectedOrderDetails.items.map((item, index) => (
                <li key={index}>
                  {item.itemName} - ${item.price.toFixed(2)}
                  <br />
                  <small>{item.description}</small>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryModal;