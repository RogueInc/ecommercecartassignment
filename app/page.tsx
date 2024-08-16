'use client';
import { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import { motion } from 'framer-motion'; 
import Link from 'next/link';
import axios from 'axios';

type Product = {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  quantity?:number;
};

const ProductsPage: NextPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [cart, setCart] = useState<Product[]>([]);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(savedCart);

    const fetchProducts = async () => {
      if (loading) return;

      setLoading(true);
      try {
        const res = await axios.get(`https://dummyjson.com/products?limit=8&skip=${(page - 1) * 8}`);
        const data = res.data;

        setProducts((prevProducts) => [...prevProducts, ...data.products]);
        setHasMore(data.products.length > 0);
      } catch (error) {
        console.error('Failed to fetch products', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page]);

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingProductIndex = prevCart.findIndex((item) => item.id === product.id);

      let updatedCart;
      if (existingProductIndex !== -1) {
        updatedCart = prevCart.map((item, index) =>
          index === existingProductIndex
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      } else {
        updatedCart = [...prevCart, { ...product, quantity: 1 }];
      }

      localStorage.setItem('cart', JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  const loadMore = () => {
    if (hasMore && !loading) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 1 >=
        document.documentElement.scrollHeight
      ) {
        loadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, loading]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Products</h1>
      <Link href="/cart" legacyBehavior>
        <a className="text-blue-500 underline mb-6 block">Go to Cart</a>
      </Link>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            className="border p-4 rounded-lg shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="overflow-hidden">
              <img
                src={product.thumbnail}
                alt={product.title}
                className="w-full h-40 object-cover rounded-md transform transition-transform duration-1000 hover:scale-150 ease-in-out"
              />
            </div>
            <h2 className="text-lg font-semibold mt-2">{product.title}</h2>
            <p className="text-gray-500">${product.price}</p>
            <button
              onClick={() => addToCart(product)}
              className="mt-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Add to Cart
            </button>
          </motion.div>
        ))}
      </div>
      {loading && <p className="text-center mt-6">Loading more products...</p>}
    </div>
  );
};

export default ProductsPage;
