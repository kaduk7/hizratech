import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const GET = async () => {

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

}