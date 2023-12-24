import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { join } from "path"
import { promises as fsPromises } from "fs"

const prisma = new PrismaClient()

export const GET = async (request: Request, { params }: { params: { id: string } }) => {
    try {
        const requestjobdesk = await prisma.komentarTb.findMany({
            where: {
                beritaId: Number(params.id)
            },
            include: {
                KaryawanTb: true,
                BeritaTb: true,
            },
            orderBy: {
                createdAt: "asc"
            }

        });
        return NextResponse.json(requestjobdesk, { status: 200 })
    } finally {
        await prisma.$disconnect();
    }
}
