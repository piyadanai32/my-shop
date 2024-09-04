import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// GET: ดึงข้อมูลสินค้าที่อยู่ในตะกร้า
export async function GET() {
  try {
    const cartItems = await prisma.cartItem.findMany({
      include: { product: true }, // ดึงข้อมูลผลิตภัณฑ์ที่เกี่ยวข้องด้วย
    });
    return NextResponse.json(cartItems);
  } catch (error) {
    console.error('Error fetching cart items:', error); // เพิ่มการ log ข้อผิดพลาด
    return NextResponse.json({ error: 'Failed to fetch cart items' }, { status: 500 });
  }
}

// POST: เพิ่มสินค้าไปยังตะกร้า
export async function POST(req) {
  const { productId, quantity } = await req.json();

  try {
    // ตรวจสอบว่ามีรายการในตะกร้าอยู่แล้วหรือไม่
    const existingCartItem = await prisma.cartItem.findFirst({
      where: { productId: productId },
    });

    if (existingCartItem) {
      // อัปเดตจำนวนสินค้าที่มีอยู่
      const updatedCartItem = await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + quantity },
      });
      return NextResponse.json(updatedCartItem, { status: 200 });
    } else {
      // เพิ่มรายการใหม่ไปยังตะกร้า
      const newCartItem = await prisma.cartItem.create({
        data: { productId, quantity },
      });
      return NextResponse.json(newCartItem, { status: 201 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add item to cart' }, { status: 500 });
  }
}
