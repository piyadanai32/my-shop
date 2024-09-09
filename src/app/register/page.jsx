"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ตรวจสอบรหัสผ่าน
    if (password !== confirmPassword) {
      setError("รหัสผ่านไม่ตรงกัน!");
      return;
    }

    // ตรวจสอบว่าข้อมูลครบ
    if (!name || !email || !password || !confirmPassword) {
      setError("กรุณาใส่ข้อมูลให้ครบ!");
      return;
    }

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setError("");
        setSuccess("ลงทะเบียนสำเร็จ");
        setTimeout(() => router.push("/login"), 1500); 
      } else {
        setError(data.error || "เกิดข้อผิดพลาดในการลงทะเบียน");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("เกิดข้อผิดพลาดในการลงทะเบียน");
    }
  };

  return (
    <div className="relative container mx-auto py-10 max-w-md px-6">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h3 className="text-3xl font-bold text-center text-gray-800">สมัครสมาชิก</h3>
          <hr className="my-5 border-gray-300" />
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-500 w-fit text-white py-1 px-3 rounded-md mt-2">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-500 w-fit text-white py-1 px-3 rounded-md mt-2">
                {success}
              </div>
            )}
            <input
              className="block w-full bg-gray-100 py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
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
            <input
              className="block w-full bg-gray-100 py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-md transition duration-300 ease-in-out"
            >
              Sign Up
            </button>
          </form>
          <hr className="my-5 border-gray-300" />
          <p className="text-center text-gray-600">
            หากมีบัญชีแล้ว? ไปที่{" "}
            <Link
              className="text-blue-500 hover:text-blue-700 hover:underline transition duration-200"
              href="/login"
            >
              เข้าสู่ระบบ
            </Link>
          </p>
        </div>
      </div>
  );
}

export default RegisterPage;
