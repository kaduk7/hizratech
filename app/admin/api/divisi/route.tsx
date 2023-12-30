import { NextResponse } from "next/server"
import { PrismaClient, DivisiTb } from "@prisma/client"

const prisma = new PrismaClient()

export const POST = async (request: Request) => {

        const body: DivisiTb = await request.json()
        const divisi = await prisma.divisiTb.create({
            data: {
                nama: body.nama,
            }
        })
        return NextResponse.json(divisi, { status: 201 })

}

export const GET = async () => {

        const divisi = await prisma.divisiTb.findMany({
            orderBy: {
                id: "asc"
            }
        });
        return NextResponse.json(divisi, { status: 200 })

}