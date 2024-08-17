'use client'
import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { NextPage } from 'next';

type Product = {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  quantity?: number; 
};

const CartPage: NextPage = () => {
  const [cart, setCart] = useState<Product[]>([]);
  const [discount, setDiscount] = useState(0.1); 

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(savedCart);
  }, []);

  const removeFromCart = (id: number) => {
    const updatedCart = cart.filter((product) => product.id !== id);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const handleQuantityChange = (id: number, newQuantity: number) => {
    const updatedCart = cart.map((product) =>
      product.id === id ? { ...product, quantity: newQuantity } : product
    );
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  // Calculate subtotal
  const calculateSubtotal = () => {
    return cart.reduce((total, product) => {
      const quantity = product.quantity || 1;
      return total + product.price * quantity;
    }, 0);
  };

  // Apply discount to subtotal
  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    return subtotal - subtotal * discount;
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Cart</h1>
      <Link href="/" legacyBehavior>
        <a className="text-blue-500 underline mb-6 block">Back to Products</a>
      </Link>
      {cart.length > 0 ? (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-6">
            {cart.map((product) => (
              <div key={product.id} className="border p-4 rounded-lg shadow-lg flex flex-col items-start">
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  className="w-full h-40 object-cover rounded-md mb-2"
                />
                <h2 className="text-lg font-semibold">{product.title}</h2>
                <p className="text-gray-500">${product.price.toFixed(2)}</p>
                <div className="flex items-center mt-2">
                  <button
                    onClick={() => handleQuantityChange(product.id, (product.quantity || 1) - 1)}
                    disabled={(product.quantity || 1) <= 1}
                    className="bg-gray-300 text-black py-1 px-2 rounded"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={product.quantity || 1}
                    min="1"
                    onChange={(e) => handleQuantityChange(product.id, Number(e.target.value))}
                    className="w-12 text-center mx-2 border rounded"
                  />
                  <button
                    onClick={() => handleQuantityChange(product.id, (product.quantity || 1) + 1)}
                    className="bg-gray-300 text-black py-1 px-2 rounded"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => removeFromCart(product.id)}
                  className="mt-2 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                >
                  Remove from Cart
                </button>
              </div>
            ))}
          </div>
          <div className="border-t pt-4 mt-6">
            <div className="flex justify-between text-lg font-semibold">
              <span>Subtotal:</span>
              <span>${calculateSubtotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-semibold mt-2">
              <span>Discount (10%):</span>
              <span>-${(calculateSubtotal() * discount).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xl font-bold mt-2">
              <span>Total:</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>
            <button
              onClick={() => alert('Checkout functionality to be implemented.')}
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Checkout
            </button>
          </div>
        </div>
      ) : (
        <p>Your cart is empty.</p>
      )}
    </div>
  );
};

export default CartPage;
