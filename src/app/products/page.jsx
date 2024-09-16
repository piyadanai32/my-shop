"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import * as Icons from 'react-icons/fa';

function ProductsPage ()  {
  const [products, setProducts] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // จัดการสถานะการเข้าสู่ระบบ
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('เรียกข้อมูลสินค้าไม่สำเร็จ', error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    // ตรวจสอบสถานะการเข้าสู่ระบบ
    const checkAuthStatus = async () => {
      try {
        const response = await fetch('/api/auth/session'); // URL ที่ตรวจสอบ session ของ NextAuth.js
        const data = await response.json();
        setIsAuthenticated(!!data?.user); // ถ้ามีข้อมูลผู้ใช้ ถือว่าล็อกอินแล้ว
      } catch (error) {
        console.error('ไม่สามารถตรวจสอบสถานะการตรวจสอบสิทธิ์ได้', error);
      }
    };

    checkAuthStatus();
  }, []);

  const handleAddToCart = async (product) => {
    if (!isAuthenticated) {
      router.push('/login'); // ถ้ายังไม่ได้ล็อกอิน ให้นำไปที่หน้า login
      return;
    }

    try {
      await fetch('/api/carts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId: product.id, quantity: 1 }),
      });
      alert(`คุณเพิ่มสินค้า ${product.name} ไปที่ตระกร้าสินค้าแล้ว`);
    } catch (error) {
      console.error('ไม่สามารถเพิ่มสินค้าลงในรถเข็นได้', error);
    }
  };

  return (
    <div className="bg-white bg-opacity-85 rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-10 text-center text-gray-900">
        คลังสินค้า
      </h1>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <li
            key={product.id}
            className="bg-white p-4 rounded-lg shadow-md"
          >
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-2 text-gray-800">
                {product.name}
              </h2>
              <p className="text-gray-600 mb-4">{product.description}</p>
              <p className="text-lg font-bold text-blue-500 mb-4">
                ราคา {product.price} บาท
              </p>
              <img
                src={product.imageUrl}
                alt={product.name}
                className="mx-auto mb-4 rounded"
                width={100}
              />
              <button
                onClick={() => handleAddToCart(product)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center justify-center mx-auto"
              >
                <Icons.FaCartPlus size={24} className="mr-2" />เพิ่มสินค้าในตะกร้า
              </button>
            </div>
          </li>
        ))}
      </ul>
      <div className="text-center mt-8">
        <Link
          href="/carts"
          className="flex items-center justify-center text-blue-500 text-lg font-semibold hover:underline"
        >
          <Icons.FaShoppingCart size={24} className="mr-2" />
          ตระกร้าสินค้า
        </Link>
      </div>
    </div>
  );
};

export default ProductsPage;
