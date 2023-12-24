import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import * as bcrypt from "bcrypt"

const prisma = new PrismaClient()

export const GET = async (request: Request, { params }: { params: { id: string } }) => {
    try {
        const karyawan = await prisma.karyawanTb.findMany({
            where: {
                NOT: {
                    id: Number(params.id)
                },
            },
            orderBy: {
                id: "asc"
            }
        });
        return NextResponse.json(karyawan, { status: 200 })
    } finally {
        await prisma.$disconnect();
    }
}

