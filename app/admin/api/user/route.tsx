import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getToken } from "next-auth/jwt"

const prisma = new PrismaClient()

export const GET = async (request: NextRequest) => {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET
    })
    const karyawanId = Number(token!.id);
  } finally {
    await prisma.$disconnect();
  }
}