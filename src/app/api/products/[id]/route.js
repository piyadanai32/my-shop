import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// GET: ดึงข้อมูลสินค้าตาม ID
export async function GET(req) {
  const { pathname } = new URL(req.url);
  const id = pathname.split('/').pop();

  try {
    const product = await prisma.product.findUnique({
      where: { id: id },
    });
    if (!product) {
      return NextResponse.json({ error: 'ไม่พบสินค้า' }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการดึงข้อมูลสินค้า:', error); // เพิ่มการ log ข้อผิดพลาด
    return NextResponse.json({ error: 'ข้อผิดพลาดภายในเซิร์ฟเวอร์' }, { status: 500 });
  }
}

// PUT: อัปเดตข้อมูลสินค้า
export async function PUT(req) {
  const { pathname } = new URL(req.url);
  const id = pathname.split('/').pop();
  const { name, description, price, quantity, imageUrl } = await req.json();

  try {
    const updatedProduct = await prisma.product.update({
      where: { id: id },
      data: {
        name,
        description,
        price,
        quantity,
        imageUrl,
      },
    });
    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการอัปเดตสินค้า:', error); // เพิ่มการ log ข้อผิดพลาด
    return NextResponse.json({ error: 'ข้อผิดพลาดภายในเซิร์ฟเวอร์' }, { status: 500 });
  }
}

// DELETE: ลบสินค้า
export async function DELETE(req) {
  const { pathname } = new URL(req.url);
  const id = pathname.split('/').pop();

  try {
    await prisma.product.delete({
      where: { id: id },
    });
    return NextResponse.json({ message: 'ลบสินค้าออกเรียบร้อยแล้ว' });
  } catch (error) {
    console.error('ข้อผิดพลาดลบสินค้า:', error); // เพิ่มการ log ข้อผิดพลาด
    return NextResponse.json({ error: 'ข้อผิดพลาดภายในเซิร์ฟเวอร์' }, { status: 500 });
  }
}
