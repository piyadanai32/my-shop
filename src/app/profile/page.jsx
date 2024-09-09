"use client";

import React from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return (
      <div>
        <div className="container mx-auto py-5">
          <h3>กำลังโหลดข้อมูล...</h3>
        </div>
      </div>
    );
  }

  if (!session) {
    router.push("/login");
    return null;
  }

  const { name, email, role } = session.user;

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full">
        <h3 className="text-3xl font-bold text-center text-gray-800 mb-6">โปรไฟล์ของฉัน</h3>
        <hr className="mb-6 border-gray-300" />
        <div className="space-y-4 text-lg">
          <p>
            <span className="font-semibold">ชื่อ</span> {name}
          </p>
          <p>
            <span className="font-semibold">อีเมล</span> {email}
          </p>
        </div>

        {role === "ADMIN" && (
          <div className="mt-6 p-4 bg-blue-50 text-blue-700 rounded-md">
            <p>คุณคือผู้ดูแลระบบ </p>
          </div>
        )}

        <div className="mt-6 flex justify-center">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="px-6 py-2 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 transition duration-300"
          >
            ออกจากระบบ
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
