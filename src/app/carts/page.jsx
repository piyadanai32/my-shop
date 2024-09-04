"use client";

import { useState, useEffect } from 'react';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await fetch('/api/carts');
        const data = await response.json();
        if (Array.isArray(data)) {
          setCartItems(data);
        } else {
          console.error('Expected an array but received:', data);
        }
      } catch (error) {
        console.error('Failed to fetch cart items', error);
      }
    };

    fetchCartItems();
  }, []);

  const handleQuantityChange = async (id, newQuantity) => {
    if (newQuantity < 1) return; // Quantity must be at least 1

    try {
      await fetch(`/api/carts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (error) {
      console.error('Failed to update quantity', error);
    }
  };

  const handleRemoveFromCart = async (id) => {
    try {
      await fetch(`/api/carts/${id}`, {
        method: 'DELETE',
      });
      setCartItems((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Failed to remove item from cart', error);
    }
  };

  return (
    <div>
      <h1>Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <ul>
          {cartItems.map((item) => (
            <li key={item.id}>
              <h2>{item.product.name}</h2>
              <p>Price: ${item.product.price}</p>
              <p>Quantity: 
                <button onClick={() => handleQuantityChange(item.id, item.quantity - 1)}>-</button>
                {item.quantity}
                <button onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>+</button>
              </p>
              <button onClick={() => handleRemoveFromCart(item.id)}>Remove from Cart</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CartPage;
