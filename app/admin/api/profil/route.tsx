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
    const karyawanId = Number(token!.karyawanId);

    const profil = await prisma.karyawanTb.findUnique({
      where: {
        id: karyawanId,
      },
      include: {
        DivisiTb: true,
        HakAksesTb: true,
        UserTb: true
      },
    })
    return NextResponse.json(profil, { status: 201 })
  } finally {
    await prisma.$disconnect();
  }
}