import { NextResponse, NextRequest } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getToken } from "next-auth/jwt"

const prisma = new PrismaClient()


export const GET = async (request: NextRequest) => {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET
    })
    const Id = Number(token!.karyawanId);

    const sekolah = await prisma.jobdeskTb.findMany({
      where: {
        OR: [
          {
            status: 'Verifikasi',
          },
          {
            status: 'Tolak',
          },
        ],
        AND: {
          karyawanId: Id,
        },
      },
      include: {
        KaryawanTb: true,
      },
      orderBy: {
        id: "asc"
      }
    })
    return NextResponse.json(sekolah, { status: 201 })
  } finally {
  }
}


