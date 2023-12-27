import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const POST = async (request: Request) => {
    try {
        const formData = await request.formData()

        const pengumuman = await prisma.pengumumanTb.create({
            data: {
                judul: String(formData.get('judul')),
                tanggalPengumuman: String(formData.get('tanggalPengumuman')),
                isi: String(formData.get('isi')),
            },
        })

        const divId = JSON.parse(String(formData.get('selected'))) as any[];

        var x = [];
        for (let i = 0; i < divId.length; i++) {
            x.push({
                pengumumanId: Number(formData.get('pengumumanId')),
                divisiId: divId[i].value,
            });
        }

        await prisma.pengumumanDivisiTb.createMany({
            data: x
        })

        return NextResponse.json([pengumuman], { status: 201 })
    } finally {
        await prisma.$disconnect();
    }
}



export const GET = async () => {
    try {
        const jobdesk = await prisma.pengumumanTb.findMany({
            include: {
                pengumumanDivisiTb: {
                    include: {
                        divisiTb: true
                    }
                }
            },
            orderBy: {
                id: "asc"
            }
        });
        return NextResponse.json(jobdesk, { status: 200 })
    } finally {
    }
}

