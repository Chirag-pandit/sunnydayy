import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../pages/CartContext';

interface CheckoutProps {
  onBack: () => void;
}

const Checkout = ({ onBack }: CheckoutProps) => {
  const { user } = useAuth();
  const { cartItems, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zip_code: '',
    country: ''
  });

  const placeOrder = async () => {
    if (!user?.uid || cartItems.length === 0) return;

    setLoading(true);
    try {
      const orderResponse = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.uid,
          items: cartItems.map(item => ({
            product_id: item.product_id,
            product_name: item.product_name,
            quantity: item.quantity,
            price: item.product_price
          })),
          total_amount: cartItems.reduce((sum, item) => sum + (item.product_price * item.quantity), 0),
          shipping_address: address,
          status: 'pending'
        }),
      });

      if (orderResponse.ok) {
        const orderData = await orderResponse.json();
        console.log('Order placed successfully:', orderData);
        
        await clearCart();
        alert('Order placed successfully!');
        onBack();
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-container">
      <button onClick={onBack} className="back-btn">← Back to Cart</button>
      <h2>Checkout</h2>
      
      <div className="checkout-content">
        <div className="address-form">
          <h3>Shipping Address</h3>
          <input
            type="text"
            placeholder="Street Address"
            value={address.street}
            onChange={(e) => setAddress({...address, street: e.target.value})}
            required
          />
          <input
            type="text"
            placeholder="City"
            value={address.city}
            onChange={(e) => setAddress({...address, city: e.target.value})}
            required
          />
          <input
            type="text"
            placeholder="State"
            value={address.state}
            onChange={(e) => setAddress({...address, state: e.target.value})}
            required
          />
          <input
            type="text"
            placeholder="ZIP Code"
            value={address.zip_code}
            onChange={(e) => setAddress({...address, zip_code: e.target.value})}
            required
          />
          <input
            type="text"
            placeholder="Country"
            value={address.country}
            onChange={(e) => setAddress({...address, country: e.target.value})}
            required
          />
        </div>

        <div className="order-summary">
          <h3>Order Summary</h3>
          {cartItems.map(item => (
            <div key={item.id} className="order-item">
              <span>{item.product_name}</span>
              <span>Qty: {item.quantity}</span>
              <span>${(item.product_price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="total">
            <strong>Total: ${cartItems.reduce((sum, item) => sum + (item.product_price * item.quantity), 0).toFixed(2)}</strong>
          </div>
        </div>
      </div>

      <button 
        onClick={placeOrder} 
        disabled={loading || cartItems.length === 0 || !address.street || !address.city}
        className="place-order-btn"
      >
        {loading ? 'Placing Order...' : 'Place Order'}
      </button>
    </div>
  );
};

export default Checkout;
