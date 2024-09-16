import { getServerSession } from "next-auth/next";                                                  //ใช้สำหรับดึงข้อมูล session ของผู้ใช้จาก NextAuth
import { PrismaClient } from "@prisma/client";
import { authOptions } from "../auth/[...nextauth]/route";                                           //การยืนยันตัวตนที่ถูกนำเข้ามาจากการตั้งค่า NextAuth

const prisma = new PrismaClient();

export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const userId = session.user.id;
  const { productId, quantity } = await req.json();

  try {
    // ตรวจสอบว่าสินค้านี้มีอยู่ในตะกร้าแล้วหรือไม่
    const existingCartItem = await prisma.cartItem.findFirst({
      where: {
        userId: userId,
        productId: productId,
      },
    });

    let cartItem;

    if (existingCartItem) {
      // ถ้ามีอยู่แล้ว ให้เพิ่มจำนวน
      cartItem = await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: {
          quantity: existingCartItem.quantity + quantity,
        },
      });
    } else {
      // ถ้าไม่มี ให้สร้างรายการใหม่
      cartItem = await prisma.cartItem.create({
        data: {
          product: { connect: { id: productId } },
          user: { connect: { id: userId } },
          quantity: quantity,
        },
      });
    }

    return new Response(JSON.stringify(cartItem), { status: 200 });
  } catch (error) {
    console.error('Error adding item to cart:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}

// GET: ดึงข้อมูลสินค้าที่อยู่ในตะกร้า
export async function GET(req) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const userId = session.user.id;

  try {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: userId },
      include: { product: true } // Include product details if needed
    });

    return new Response(JSON.stringify(cartItems), { status: 200 });
  } catch (error) {
    console.error('Error fetching cart items:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}

