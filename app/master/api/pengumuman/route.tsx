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
        const DivisiId = Number(token!.divisiId);

        const jobdesk = await prisma.pengumumanDivisiTb.findMany({
            where: {
                divisiId: DivisiId,
            },
            include: {
                pengumumanTb: true,
                divisiTb: true
            },
            orderBy: {
                id: "asc"
            }
        });
        return NextResponse.json(jobdesk, { status: 200 })
    } finally {
    }
}

