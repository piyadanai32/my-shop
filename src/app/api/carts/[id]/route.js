import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// PUT: อัปเดตจำนวนสินค้าในตะกร้า
export async function PUT(req) {
  const id = req.url.split('/').pop(); // ดึง ID จาก URL
  const { quantity } = await req.json();

  if (quantity < 1) {
    return NextResponse.json({ error: 'Quantity must be at least 1' }, { status: 400 });
  }

  try {
    const updatedCartItem = await prisma.cartItem.update({
      where: { id: id },
      data: { quantity },
    });
    return NextResponse.json(updatedCartItem);
  } catch (error) {
    console.error('Error updating cart item:', error); // เพิ่มการ log ข้อผิดพลาด
    return NextResponse.json({ error: 'Failed to update cart item' }, { status: 500 });
  }
}

// DELETE: ลบสินค้าจากตะกร้า
export async function DELETE(req) {
  const id = req.url.split('/').pop(); // ดึง ID จาก URL

  try {
    await prisma.cartItem.delete({
      where: { id: id },
    });
    return NextResponse.json({ message: 'Item removed from cart successfully' });
  } catch (error) {
    console.error('Error removing item from cart:', error); // เพิ่มการ log ข้อผิดพลาด
    return NextResponse.json({ error: 'Failed to remove item from cart' }, { status: 500 });
  }
}
