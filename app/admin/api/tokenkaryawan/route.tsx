import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { join } from "path"
import { promises as fsPromises } from "fs"
import { getToken } from "next-auth/jwt"

const prisma = new PrismaClient()

export const GET = async (request: NextRequest) => {
    try {
        const token = await getToken({
            req: request,
            secret: process.env.NEXTAUTH_SECRET
        })
        const Id = Number(token!.karyawanId);
        const karyawan = await prisma.karyawanTb.findUnique({
            where: {
                id: Id
            },
            include: {
                DivisiTb: true
            }

        })

        return NextResponse.json(karyawan, { status: 200 })
    } finally {
        await prisma.$disconnect();
    }
}
