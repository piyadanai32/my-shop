import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
// import GitHubProvider from "next-auth/providers/github";
import { PrismaClient } from "@prisma/client";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcryptjs";

// สร้าง Prisma Client เพื่อเชื่อมต่อกับฐานข้อมูล
const prisma = new PrismaClient();

// ตั้งค่า NextAuth options
export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        // ค้นหาผู้ใช้จากฐานข้อมูลตามอีเมล
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        // ตรวจสอบรหัสผ่านที่เข้ารหัสแล้ว
        if (user && await bcrypt.compare(credentials.password, user.password)) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          };
        } else {
          throw new Error("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
        }
      },
    }),
    // GitHubProvider({
    //   clientId: process.env.GITHUB_ID,
    //   clientSecret: process.env.GITHUB_SECRET,
    // }),
  ],
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
};

// ฟังก์ชันสำหรับจัดการ HTTP GET (เช็ก session)
export const GET = async (req, res) => {
  return NextAuth(req, res, authOptions);
};

// ฟังก์ชันสำหรับจัดการ HTTP POST (การเข้าสู่ระบบ)
export const POST = async (req, res) => {
  return NextAuth(req, res, authOptions);
};
