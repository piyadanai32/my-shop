import { getServerSession } from "next-auth/next";                                                  //ใช้สำหรับดึงข้อมูล session ของผู้ใช้จาก NextAuth
import { PrismaClient } from "@prisma/client";
import { authOptions } from "../auth/[...nextauth]/route";                                           //การยืนยันตัวตนที่ถูกนำเข้ามาจากการตั้งค่า NextAuth

const prisma = new PrismaClient();

export async function POST(req) {
  const session = await getServerSession(authOptions);                                                //ใช้เพื่อดึงข้อมูล session ของผู้ใช้จาก NextAuth ซึ่งช่วยในการตรวจสอบว่าใครเป็นผู้ที่กำลังทำคำร้อง

  if (!session || !session.user || !session.user.id) {
    return new Response(JSON.stringify({ error: 'ไม่ได้รับอนุญาต' }), { status: 401 });
  }

  const userId = session.user.id;                                                                           // ดึง userId จาก session ของผู้ใช้ที่ล็อกอิน
  const { productId, quantity } = await req.json();                                                             // อ่านข้อมูล productId และจำนวน (quantity) จาก body ของ request

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
    console.error('เกิดข้อผิดพลาดในการเพิ่มสินค้าลงในรถเข็น:', error);
    return new Response(JSON.stringify({ error: 'ข้อผิดพลาดภายในเซิร์ฟเวอร์' }), { status: 500 });
  }
}

// GET: ดึงข้อมูลสินค้าที่อยู่ในตะกร้า
export async function GET(req) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    return new Response(JSON.stringify({ error: 'ไม่ได้รับอนุญาต' }), { status: 401 });
  }

  const userId = session.user.id;

  try {
    // ดึงข้อมูลสินค้าที่อยู่ในตะกร้าของผู้ใช้โดยใช้ userId
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: userId },                                                                    // ค้นหาทุกสินค้าที่อยู่ในตะกร้าของผู้ใช้คนนี้
      include: { product: true }                                                                    // รวมรายละเอียดของสินค้าด้วย
    });

    return new Response(JSON.stringify(cartItems), { status: 200 });
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการดึงข้อมูลสินค้าในรถเข็น:', error);
    return new Response(JSON.stringify({ error: 'ข้อผิดพลาดภายในเซิร์ฟเวอร์' }), { status: 500 });
  }
}

