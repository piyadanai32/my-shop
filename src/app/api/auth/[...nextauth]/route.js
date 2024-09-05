import NextAuth from "next-auth";
import { authOptions } from "@/ilb/nextAuth";

export const GET = (req, res) => NextAuth(req, res, authOptions);
export const POST = (req, res) => NextAuth(req, res, authOptions);