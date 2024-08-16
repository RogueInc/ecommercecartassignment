'use client'
import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { NextPage } from 'next';

type Product = {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
};

const CartPage: NextPage = () => {
  const [cart, setCart] = useState<Product[]>([]);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(savedCart);
  }, []);

  const removeFromCart = (id: number) => {
    const updatedCart = cart.filter((product) => product.id !== id);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Cart</h1>
      <Link href="/" legacyBehavior>
        <a className="text-blue-500 underline mb-6 block">Back to Products</a>
      </Link>
      {cart.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {cart.map((product) => (
            <div key={product.id} className="border p-4 rounded-lg shadow-lg">
              <img
                src={product.thumbnail}
                alt={product.title}
                className="w-full h-40 object-cover rounded-md"
              />
              <h2 className="text-lg font-semibold mt-2">{product.title}</h2>
              <p className="text-gray-500">${product.price}</p>
              <button
                onClick={() => removeFromCart(product.id)}
                className="mt-2 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
              >
                Remove from Cart
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>Your cart is empty.</p>
      )}
    </div>
  );
};

export default CartPage;
