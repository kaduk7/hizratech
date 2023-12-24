import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()


export const GET = async (request: NextRequest) => {
    try {

        const jobdesk = await prisma.beritaTb.findFirst({
            orderBy: { id: 'desc' }
        });
        return NextResponse.json(jobdesk, { status: 200 })
    } finally {
        await prisma.$disconnect();
    }
}
