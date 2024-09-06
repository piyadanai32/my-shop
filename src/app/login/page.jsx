"use client"; // เพิ่มบรรทัดนี้เพื่อบอกว่าเป็น Client Component

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
<div>
  <div className="container mx-auto py-5 max-w-md px-4">
    <h3 className="text-2xl font-semibold text-center">Login Page</h3>
    <hr className="my-5" />
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        className="block w-full bg-gray-200 py-2 px-4 mx-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="block w-full bg-gray-200 py-2 px-4 mx-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
        type="password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        type="submit"
        className="bg-green-500 hover:bg-green-600 p-2 rounded-md text-white transition duration-300 ease-in-out"
      >
        Login
      </button>
    </form>
    <hr className="my-5" />
    <p className="text-center">
      หากยังไม่มีบัญชี? ไปที่{" "}
      <Link className="text-blue-500 hover:text-blue-700 hover:underline transition duration-200" href="/register">Register</Link>{" "}
      Page
    </p>
    {error && <p className="text-red-500 mt-3 transition duration-300 ease-in-out">{error}</p>}
  </div>
</div>
  );
}

export default LoginPage;
