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
      <div className="container mx-auto py-5">
        <h3>Login Page</h3>
        <hr className="my-3" />
        <form onSubmit={handleSubmit}>
          <input
            className="block bg-gray-300 py-2 mx-2 rounded-md"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="block bg-gray-300 py-2 mx-2 rounded-md"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="bg-green-400 p-2 rounded-md text-white"
          >
            Login
          </button>
        </form>
        <hr className="my-3" />
        <p>
          หากยังไม่มีบัญชี? ไปที่{" "}
          <Link className="text-blue-500 hover:underline" href="/register">Register</Link>{" "}
          Page
        </p>
        {error && <p className="text-red-500 mt-3">{error}</p>}
      </div>
    </div>
  );
}

export default LoginPage;
