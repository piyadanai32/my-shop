import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';

const prisma = new PrismaClient();

export async function PUT(req) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;
  const url = new URL(req.url);
  const id = url.pathname.split('/').pop(); // ดึง id ออกมาจาก URL

  if (!id) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  const { quantity } = await req.json();

  if (quantity < 1) {
    return NextResponse.json({ error: 'Quantity must be at least 1' }, { status: 400 });
  }

  try {
    const cartItem = await prisma.cartItem.findFirst({
      where: { id: id, userId: userId }, // ใช้ id เป็น String
    });

    if (!cartItem) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    const updatedCartItem = await prisma.cartItem.update({
      where: { id: id }, // ใช้ id เป็น String
      data: { quantity },
    });

    return NextResponse.json(updatedCartItem);
  } catch (error) {
    console.error('Error updating cart item:', error);
    return NextResponse.json({ error: 'Failed to update cart item' }, { status: 500 });
  }
}

export async function DELETE(req) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;
  const url = new URL(req.url);
  const id = url.pathname.split('/').pop(); // ดึง id ออกมาจาก URL

  // ตรวจสอบว่า id มีค่า
  if (!id) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  try {
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: id, // ใช้ id เป็น String
        userId: userId,
      },
    });

    if (!cartItem) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    await prisma.cartItem.delete({
      where: { id: id }, // ใช้ id เป็น String
    });

    return NextResponse.json({ message: 'Item removed from cart successfully' });
  } catch (error) {
    console.error('Error removing item from cart:', error);
    return NextResponse.json({ error: 'Failed to remove item from cart' }, { status: 500 });
  }
}
