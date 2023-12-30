import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const PATCH = async (request: Request, { params }: { params: { id: string } }) => {
        const formData = await request.formData()
        const newdivisi = formData.get('newdivisi')
        const divisiId = formData.getAll('divisiId').map(Number);
        const pengumuman = await prisma.pengumumanTb.update({
            where: {
                id: Number(params.id)
            },
            data: {
                judul: String(formData.get('judul')),
                tanggalPengumuman: String(formData.get('tanggalPengumuman')),
                isi: String(formData.get('isi')),
            }
        })

        if (newdivisi === 'yes') {

            const deletepengumuman = await prisma.pengumumanDivisiTb.deleteMany({
                where: {
                    pengumumanId: Number(formData.get('pengumumanId')),
                }
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

            return NextResponse.json([deletepengumuman], { status: 200 })
        }

        return NextResponse.json({ status: 200, pesan: "berhasil" })

}


export const DELETE = async (request: Request, { params }: { params: { id: string } }) => {
        const pengumuman = await prisma.pengumumanTb.delete({
            where: {
                id: Number(params.id)
            }
        })
        return NextResponse.json(pengumuman, { status: 200 })

}

export const GET = async (request: Request, { params }: { params: { id: string } }) => {
        const xxx = await prisma.pengumumanDivisiTb.findMany({
            where: {
                pengumumanId: Number(params.id)
            },
            include: {
                divisiTb: true
            },
            orderBy: {
                id: "asc"
            }
        });
        return NextResponse.json(xxx, { status: 200 })

}