import React, { useState, useEffect, useContext, useCallback } from 'react';
import { UserContext } from '../UserContext';
import OrderHistoryModal from '../OrderHistoryModal/OrderHistoryModal';
import './MenuItems.css';

const MenuItems = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : {};
  });
  const [isOrderHistoryOpen, setIsOrderHistoryOpen] = useState(false);
  const { user } = useContext(UserContext);

  const fetchMenuItems = useCallback(async () => {
    const token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MjM0MTE2MDEsIm5iZiI6MzQxMDI1MjI2OSwiZXhwIjozNDEwMjU1ODY5LCJhdWQiOiJzZDQ1NHZzZHZzNTM0YnNhIiwiaXNzIjoiaHR0cHM6Ly9yZXN0dXJhbnQtb2F1dGguY29tIiwic3ViIjoiOWI0NmM1NjQtZmEyMy0xMWVkLWFlODUtN2IxNDI4MDBhYjFiIiwianRpIjoiZmZjMzk1YmE4YjI3NmQ1ZDA1YjMxZWI0MWFiMGIzMDk3YmViNTFjMWFmMTZmYmY2M2ViMzExOGZlYjRkOTBlZGVhNWY5ZjA2MzY2ZTYwNDcifQ.FZvKGdDboslbAg2N1rbPMfjDzbQ179gUnyuBqDzsrt8062KVyiv5BkTkzNzmmvoLBYNq734xXRE_zzQn_dLjHrwf6xGbpI-sEthxBR_JAyHdnJfG2MDrNfmtC_BTChUN0BJ-9kK4-1wXAZehrcBuxbxEZRmyllHJIR90Cj_y5hcD4eK5igmhDx1AseMM_unXerqnLTXKAngZOa-c7IJItRIjX5_Umz-y63sex7eIbqKYHKGEz5leUBKjHX6IVdYko5cfX1zfXohnzR6pSXPFyLyd1xFjsnQrEpjREyrdwtrEZtBM9QNWNqcrk1bktwLVBdlDZwt7AJAeEOs_mOuGSg';

    try {
      const response = await fetch('http://localhost:14289/menu/api/MenuItem/Get', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      return data.items;
    } catch (error) {
      throw new Error('Error fetching menu items: ' + error.message);
    }
  }, []);

  useEffect(() => {
    const loadMenuAndCart = async () => {
      try {
        const items = await fetchMenuItems();
        setMenuItems(items);
        
        // Validate cart items against loaded menu items
        setCart(prevCart => {
          const validatedCart = Object.entries(prevCart).reduce((acc, [itemId, quantity]) => {
            if (items.some(item => item.Id === parseInt(itemId))) {
              acc[itemId] = quantity;
            }
            return acc;
          }, {});
          return validatedCart;
        });

        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    loadMenuAndCart();
  }, [fetchMenuItems]);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = useCallback((item) => {
    setCart(prevCart => {
      const newCart = {
        ...prevCart,
        [item.Id]: (prevCart[item.Id] || 0) + 1
      };
      return newCart;
    });
    
    // Add the 'item-added' class to the cart item
    const cartItem = document.querySelector(`[data-item-id="${item.Id}"]`);
    if (cartItem) {
      cartItem.classList.add('item-added');
      setTimeout(() => cartItem.classList.remove('item-added'), 300);
    }
  }, []);

  const removeFromCart = useCallback((itemId) => {
    setCart(prevCart => {
      const newCart = { ...prevCart };
      if (newCart[itemId] > 1) {
        newCart[itemId]--;
      } else {
        delete newCart[itemId];
      }
      return newCart;
    });
  }, []);

  const emptyCart = useCallback(() => {
    setCart({});
  }, []);

  const submitOrder = useCallback(() => {
    if (!user) {
      alert("Please sign in to submit an order.");
      return;
    }
    console.log("Order submitted:", cart);
    alert("Order submitted successfully!");
    setCart({});
  }, [cart, user]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="menu-container" key={menuItems.length}>
            <h1>Our Delicious Menu</h1>
      <div style={{textAlign: 'right'}}>
        {user && (
          <button onClick={() => setIsOrderHistoryOpen(true)} className="order-history-btn">
            My Orders
          </button>
        )}
      </div>
      <div className="menu-grid">
        {menuItems.map((item, index) => (
          <div 
            key={item.Id} 
            className="menu-item"
            style={{animationDelay: `${index * 0.1}s`}}
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
              if (!item) return null; // Skip if item not found in menu
              return (
                <div key={itemId} className="cart-item" data-item-id={itemId}>
                  <span>{item.ItemName}</span>
                  <div>
                    <button onClick={() => removeFromCart(itemId)}>-</button>
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
    </div>
  );
};

export default MenuItems;