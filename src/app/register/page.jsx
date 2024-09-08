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
        setTimeout(() => router.push("/login"), 2000); // นำไปหน้า login หลัง 2 วินาที
      } else {
        setError(data.error || "เกิดข้อผิดพลาดในการลงทะเบียน");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("เกิดข้อผิดพลาดในการลงทะเบียน");
    }
  };

  return (
    <div>
      <div className="container mx-auto py-5 max-w-lg px-4">
        <h3 className="text-2xl font-semibold text-center">Register Page</h3>
        <hr className="my-5" />
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="bg-red-500 w-fit text-white py-1 px-3 rounded-md mt-2">{error}</div>}
          {success && <div className="bg-green-500 w-fit text-white py-1 px-3 rounded-md mt-2">{success}</div>}
          <input
            className="block w-full bg-gray-200 py-2 px-4 mx-2 rounded-md"
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="block w-full bg-gray-200 py-2 px-4 mx-2 rounded-md"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="block w-full bg-gray-200 py-2 px-4 mx-2 rounded-md"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            className="block w-full bg-gray-200 py-2 px-4 mx-2 rounded-md"
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button type="submit" className="bg-green-500 hover:bg-green-600 p-2 rounded-md text-white">
            Sign Up
          </button>
        </form>
        <hr className="my-5" />
        <p className="text-center">
          หากมีบัญชีแล้ว? ไปที่{" "}
          <Link className="text-blue-500 hover:text-blue-700" href="/login">Login</Link>{" "}
          Page
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
