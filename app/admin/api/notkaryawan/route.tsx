import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import * as bcrypt from "bcrypt"

const prisma = new PrismaClient()

export const GET = async () => {
    try {
        const karyawan = await prisma.karyawanTb.findMany({
            include: {
                DivisiTb: true,
                HakAksesTb: true,
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