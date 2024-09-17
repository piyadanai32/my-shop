import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';                                                     // นำเข้า NextResponse เพื่อส่งข้อมูลกลับในรูปแบบ JSON
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';                                     // นำเข้าการยืนยันตัวตนจาก NextAuth

const prisma = new PrismaClient();

export async function PUT(req) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: 'ไม่ได้รับอนุญาต' }, { status: 401 });
  }

  const userId = session.user.id;                                                                   
  const url = new URL(req.url);                                                                       // สร้าง object URL จาก req.url เพื่อใช้ในการแยกข้อมูล URL
  const id = url.pathname.split('/').pop();                                                         // ดึง id ออกมาจาก URL

  if (!id) {
    return NextResponse.json({ error: 'รหัสไม่ถูกต้อง' }, { status: 400 });
  }

  const { quantity } = await req.json();

  if (quantity < 1) {
    return NextResponse.json({ error: 'จำนวนต้องมีอย่างน้อย 1' }, { status: 400 });
  }

  try {
    // ตรวจสอบว่ารายการสินค้าในตะกร้ามีอยู่หรือไม่
    const cartItem = await prisma.cartItem.findFirst({
      where: { id: id, userId: userId }, // ใช้ id เป็น String
    });

    if (!cartItem) {
      return NextResponse.json({ error: 'ไม่พบรายการ' }, { status: 404 });
    }
     // อัปเดตจำนวนสินค้าในรายการตะกร้า
    const updatedCartItem = await prisma.cartItem.update({
      where: { id: id }, // ใช้ id เป็น String
      data: { quantity },
    });

    return NextResponse.json(updatedCartItem);
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการอัปเดตรายการในรถเข็น:', error);
    return NextResponse.json({ error: 'ข้อผิดพลาดภายในเซิร์ฟเวอร์' }, { status: 500 });
  }
}

export async function DELETE(req) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: 'ไม่ได้รับอนุญาต' }, { status: 401 });
  }

  const userId = session.user.id;
  const url = new URL(req.url);
  const id = url.pathname.split('/').pop(); // ดึง id ออกมาจาก URL

  // ตรวจสอบว่า id มีค่า
  if (!id) {
    return NextResponse.json({ error: 'รหัสไม่ถูกต้อง' }, { status: 400 });
  }

  try {
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: id, // ใช้ id เป็น String
        userId: userId,
      },
    });

    if (!cartItem) {
      return NextResponse.json({ error: 'ไม่พบรายการ' }, { status: 404 });
    }
    
    // ลบรายการสินค้าออกจากตะกร้า
    await prisma.cartItem.delete({
      where: { id: id }, // ใช้ id เป็น String
    });

    return NextResponse.json({ message: 'นำสินค้าออกจากรถเข็นเรียบร้อยแล้ว' });
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการลบรายการออกจากรถเข็น:', error);
    return NextResponse.json({ error: 'ข้อผิดพลาดภายในเซิร์ฟเวอร์' }, { status: 500 });
  }
}
