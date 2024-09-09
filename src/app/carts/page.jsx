"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ProductsS from "../components/productsS";
import * as Icons from "react-icons/fa";

const CartPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/login");
      return;
    }

    const fetchCartItems = async () => {
      try {
        const response = await fetch("/api/carts");
        const data = await response.json();
        if (Array.isArray(data)) {
          setCartItems(data);
        } else {
          console.error("คาดหวังข้อมูลเป็นอาเรย์ แต่ได้รับ:", data);
        }
      } catch (error) {
        console.error("ไม่สามารถดึงข้อมูลรายการรถเข็นได้", error);
      }
    };

    fetchCartItems();
  }, [session, status, router]);

  const handleQuantityChange = async (id, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      const response = await fetch(`/api/carts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      if (response.ok) {
        setCartItems((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, quantity: newQuantity } : item
          )
        );
      } else {
        console.error("ไม่สามารถอัปเดตจำนวนได้");
      }
    } catch (error) {
      console.error("ไม่สามารถอัปเดตจำนวนได้", error);
    }
  };

  const handleRemoveFromCart = async (id) => {
    try {
      const response = await fetch(`/api/carts/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setCartItems((prev) => prev.filter((item) => item.id !== id));
      } else {
        console.error("ไม่สามารถลบรายการจากรถเข็นได้");
      }
    } catch (error) {
      console.error("ไม่สามารถลบรายการจากรถเข็นได้", error);
    }
  };

  return (
    <div
    className="relative bg-cover bg-center bg-no-repeat"
    style={{
      backgroundImage: "url('/images/hsdy.png')",
      width: "100%",
      height: "100vh",
    }}
  >
      <div className="bg-white bg-opacity-80 rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-900">
        ตระกร้าสินค้าของคุณ
        </h1>
        {cartItems.length === 0 ? (
          <p className="text-lg text-gray-600 text-center">
            ตระกร้าสินค้าของคุณว่างเปล่า
          </p>
        ) : (
          <ul className="space-y-6">
            {cartItems.map((item) => (
              <li
                key={item.id}
                className="bg-white shadow-lg rounded-lg p-6 flex items-center space-x-6"
              >
                <img
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                />
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold mb-2 text-gray-800">
                    {item.product.name}
                  </h2>
                  <p className="text-gray-700 mb-2">
                    ราคา {(item.product.price * item.quantity).toFixed(2)} บาท
                  </p>
                  <div className="flex items-center space-x-4 mt-4">
                    <p className="text-gray-700">จำนวน</p>
                    <button
                      onClick={() =>
                        handleQuantityChange(item.id, item.quantity - 1)
                      }
                      className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                    >
                      -
                    </button>
                    <span className="text-lg font-medium">{item.quantity}</span>
                    <button
                      onClick={() =>
                        handleQuantityChange(item.id, item.quantity + 1)
                      }
                      className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveFromCart(item.id)}
                  className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition ml-4"
                >
                  <Icons.FaTrash size={20} />
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-10">
          <ProductsS cartItems={cartItems} />
        </div>
      </div>
    </div>
  );
    
};

export default CartPage;
