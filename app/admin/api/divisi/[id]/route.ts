import { NextResponse } from "next/server"
import { DivisiTb, PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const PATCH = async (request: Request, { params }: { params: { id: string } }) => {
    try {
        const body: DivisiTb = await request.json()
        const divisi = await prisma.divisiTb.update({
            where: {
                id: Number(params.id)
            },
            data: {
                nama: body.nama,
            }
        })
        return NextResponse.json(divisi, { status: 200 })
    } finally {
        await prisma.$disconnect();
    }
}


export const GET = async (request: Request, { params }: { params: { id: string } }) => {
    try {
        const divisi = await prisma.divisiTb.findUnique({
            where: {
                id: Number(params.id)
            },
        });
        return NextResponse.json(divisi, { status: 200 })
    } finally {
        await prisma.$disconnect();
    }
}

export const DELETE = async (request: Request, { params }: { params: { id: string } }) => {
    try {
        const divisi = await prisma.divisiTb.delete({
            where: {
                id: Number(params.id)
            }
        })
        return NextResponse.json(divisi, { status: 200 })
    } finally {
        await prisma.$disconnect();
    }
}