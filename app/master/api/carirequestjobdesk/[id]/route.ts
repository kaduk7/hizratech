import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const GET = async (request: Request, { params }: { params: { id: string } }) => {
    try {
        const requestjobdesk = await prisma.requestJobdeskTb.findUnique({
            where: {
                id: Number(params.id)
            },
            include: {
                KaryawanTb: true
            }
        });
        return NextResponse.json(requestjobdesk, { status: 200 })
    } finally {
        await prisma.$disconnect();
    }
}
