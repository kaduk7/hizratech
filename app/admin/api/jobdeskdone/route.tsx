import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const GET = async () => {
    try {
        const jobdesk = await prisma.jobdeskTb.findMany({
            include: {
                KaryawanTb: true
            },
            orderBy: {
                id: "asc"
            }
        });
        return NextResponse.json(jobdesk, { status: 200 })
    } finally {
        await prisma.$disconnect();
    }
}
