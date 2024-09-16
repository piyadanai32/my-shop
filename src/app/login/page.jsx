"use client"; //ให้ Next.js รู้ว่าคอมโพเนนต์นี้จะทำงานบนฝั่ง Client

import React, { useState, useEffect } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    // ตรวจสอบสถานะการเข้าสู่ระบบเมื่อโหลดหน้า
    const checkSession = async () => {
      const session = await getSession();
      if (session) {
        // ถ้ามีเซสชัน, เปลี่ยนเส้นทางไปที่ /profile
        router.replace("/profile");
      }
    };

    checkSession();
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res.error) {
        setError("เกิดข้อผิดพลาด: " + res.error);
      } else if (res.ok) {
        router.replace("/profile");
      }
    } catch (error) {
      console.error("Error during sign in:", error);
      setError("เกิดข้อผิดพลาดในการเข้าสู่ระบบ");
    }
  };

  return (
      <div className="relative container mx-auto py-10 max-w-md px-6">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h3 className="text-3xl font-bold text-center text-gray-800">เข้าสู่ระบบ</h3>
          <hr className="my-5 border-gray-300" />
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              className="block w-full bg-gray-100 py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="block w-full bg-gray-100 py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-md transition duration-300 ease-in-out"
            >
              Login
            </button>
          </form>
          <hr className="my-5 border-gray-300" />
          <p className="text-center text-gray-600">
            หากยังไม่มีบัญชี? ไปที่{" "}
            <Link
              className="text-blue-500 hover:text-blue-700 hover:underline transition duration-200"
              href="/register"
            >
              สมัครสมาชิก
            </Link>
          </p>
          {error && (
            <p className="text-red-500 mt-3 transition duration-300 ease-in-out text-center">
              {error}
            </p>
          )}
        </div>
      </div>
  );
}

export default LoginPage;
