import React, { useState, useEffect, useContext, useCallback } from 'react';
import { UserContext } from '../UserContext';
import OrderHistoryModal from '../OrderHistoryModal/OrderHistoryModal';
import SimpleOrderConfirmationModal from '../SimpleOrderConfirmationModal/SimpleOrderConfirmationModal';
import './MenuItems.css';
import '../SimpleOrderConfirmationModal/SimpleOrderConfirmationModal.css';

const MenuItems = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState({});
  const [animatedItems, setAnimatedItems] = useState({});
  const [isOrderHistoryOpen, setIsOrderHistoryOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [orderDetails, setOrderDetails] = useState([]);
  const { user } = useContext(UserContext);

  const token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MjM0MTE2MDEsIm5iZiI6MzQxMDI1MjI2OSwiZXhwIjozNDEwMjU1ODY5LCJhdWQiOiJzZDQ1NHZzZHZzNTM0YnNhIiwiaXNzIjoiaHR0cHM6Ly9yZXN0dXJhbnQtb2F1dGguY29tIiwic3ViIjoiOWI0NmM1NjQtZmEyMy0xMWVkLWFlODUtN2IxNDI4MDBhYjFiIiwianRpIjoiZmZjMzk1YmE4YjI3NmQ1ZDA1YjMxZWI0MWFiMGIzMDk3YmViNTFjMWFmMTZmYmY2M2ViMzExOGZlYjRkOTBlZGVhNWY5ZjA2MzY2ZTYwNDcifQ.FZvKGdDboslbAg2N1rbPMfjDzbQ179gUnyuBqDzsrt8062KVyiv5BkTkzNzmmvoLBYNq734xXRE_zzQn_dLjHrwf6xGbpI-sEthxBR_JAyHdnJfG2MDrNfmtC_BTChUN0BJ-9kK4-1wXAZehrcBuxbxEZRmyllHJIR90Cj_y5hcD4eK5igmhDx1AseMM_unXerqnLTXKAngZOa-c7IJItRIjX5_Umz-y63sex7eIbqKYHKGEz5leUBKjHX6IVdYko5cfX1zfXohnzR6pSXPFyLyd1xFjsnQrEpjREyrdwtrEZtBM9QNWNqcrk1bktwLVBdlDZwt7AJAeEOs_mOuGSg';

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch('http://localhost:14289/front/api/MenuItem/Get', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setMenuItems(data.items);
        setLoading(false);
      } catch (error) {
        setError('Error fetching menu items: ' + error.message);
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  const addToCart = (item) => {
    setCart(prevCart => ({
      ...prevCart,
      [item.Id]: (prevCart[item.Id] || 0) + 1
    }));

    setAnimatedItems(prev => ({ ...prev, [item.Id]: true }));
    setTimeout(() => setAnimatedItems(prev => ({ ...prev, [item.Id]: false })), 300);
  };

  const removeFromCart = (itemId) => {
    setCart(prevCart => {
      const newCart = { ...prevCart };
      if (newCart[itemId] > 1) {
        newCart[itemId]--;
      } else {
        delete newCart[itemId];
      }
      return newCart;
    });

    setAnimatedItems(prev => ({ ...prev, [itemId]: true }));
    setTimeout(() => setAnimatedItems(prev => ({ ...prev, [itemId]: false })), 300);
  };

  const emptyCart = () => {
    setCart({});
  };

  const submitOrder = useCallback(async () => {
    if (!user) {
      alert("Please sign in to submit an order.");
      return;
    }
    const payload = {
      OrderItems: cart,
      CustomerEmail: user.email,
      CustomerFirstname: user.firstName,
      CustomerLastname: user.lastName,
      CustomerPhone: user.phone
    };

    try {
      const response = await fetch('http://localhost:14289/orders/api/order/SaveOrder', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Failed to submit order');
      }

      const data = await response.json();
      console.log("Order submitted successfully:", data);

      const details = Object.entries(cart).map(([itemId, quantity]) => {
        const item = menuItems.find(item => item.Id === parseInt(itemId));
        return `${item.ItemName} x ${quantity}`;
      });
      setOrderDetails(details);

      setIsConfirmationOpen(true);
      setCart({});
    } catch (error) {
      console.error("Error submitting order:", error);
      alert("Failed to submit order. Please try again.");
    }
  }, [cart, user, menuItems]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="menu-container">
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative'
      }}>
        <div style={{ flex: 1 }}></div>
        <h1 style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          textAlign: 'center'
        }}>
          Our Delicious Menu
        </h1>
        {user && (
          <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', marginTop: '30px', zIndex: '100' }}>
            <button
              onClick={() => setIsOrderHistoryOpen(true)}
              className="order-history-btn"
            >
              My Orders
            </button>
          </div>
        )}
      </div>

      <div className="menu-grid">
        {menuItems.map((item, index) => (
          <div
            key={item.Id}
            className="menu-item"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <h2>{item.ItemName}</h2>
            <p className="description">{item.Description}</p>
            <div className="item-footer">
              <span className="price">${item.Price.toFixed(2)}</span>
              <span className="category">{item.Category}</span>
            </div>
            <button onClick={() => addToCart(item)} className="add-to-cart-btn">Add to Cart</button>
          </div>
        ))}
      </div>

      <div className="cart">
        <h2>My Delicious Cart</h2>
        {Object.keys(cart).length === 0 ? (
          <p>Your cart is empty :(</p>
        ) : (
          <>
            {Object.entries(cart).map(([itemId, quantity]) => {
              const item = menuItems.find(item => item.Id === parseInt(itemId));
              if (!item) return null;
              return (
                <div
                  key={itemId}
                  className={`cart-item ${animatedItems[item.Id] ? 'item-added' : ''}`}
                >
                  <span>{item.ItemName}</span>
                  <div>
                    <button onClick={() => removeFromCart(item.Id)}>-</button>
                    <span>{quantity}</span>
                    <button onClick={() => addToCart(item)}>+</button>
                  </div>
                  <span>${(item.Price * quantity).toFixed(2)}</span>
                </div>
              );
            })}
            <div className="cart-total">
              <strong>Total: ${Object.entries(cart).reduce((total, [itemId, quantity]) => {
                const item = menuItems.find(item => item.Id === parseInt(itemId));
                return item ? total + item.Price * quantity : total;
              }, 0).toFixed(2)}</strong>
            </div>
            <button onClick={submitOrder} className="submit-order-btn" disabled={!user}>
              {user ? 'Submit Order' : 'Sign in to Order'}
            </button>
            <button onClick={emptyCart} className="empty-cart-btn">Empty Cart</button>
          </>
        )}
      </div>

      <OrderHistoryModal
        isOpen={isOrderHistoryOpen}
        onClose={() => setIsOrderHistoryOpen(false)}
      />
      <SimpleOrderConfirmationModal
        isOpen={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        orderDetails={orderDetails}
      />
    </div>
  );
};

export default MenuItems;