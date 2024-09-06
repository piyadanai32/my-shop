import { getServerSession } from "next-auth/next";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const userId = session.user.id;
  const { productId, quantity } = await req.json();

  console.log('User ID:', userId);
  console.log('Product ID:', productId);
  console.log('Quantity:', quantity);

  try {
    const cartItem = await prisma.cartItem.create({
      data: {
        product: { connect: { id: productId } },
        user: { connect: { id: userId } },
        quantity: quantity
      }
    });

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

