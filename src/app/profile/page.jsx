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
    <div>
      <div className="container mx-auto py-5">
        <h3 className="text-2xl font-bold mb-4">โปรไฟล์ของคุณ</h3>
        <hr className="my-3" />
        <p><strong>ชื่อ:</strong> {name}</p>
        <p><strong>อีเมล:</strong> {email}</p>
        {/* <p><strong>บทบาท:</strong> {role === "admin" ? "ผู้ดูแลระบบ" : "ผู้ใช้ทั่วไป"}</p> */}

        {role === "ADMIN" && (
          <div className="mt-5 p-4 bg-blue-100 text-blue-700 rounded-md">
            <p>คุณคือผู้ดูแลระบบ คุณสามารถเข้าถึงและจัดการข้อมูลทั้งหมดในระบบได้</p>
          </div>
        )}

        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="mt-5 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
        >
          ออกจากระบบ
        </button>
      </div>
    </div>
  );
}

export default ProfilePage;
