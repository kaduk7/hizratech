import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { join } from "path"
import { promises as fsPromises } from "fs"

const prisma = new PrismaClient()

export const POST = async (request: Request) => {
    try {
        const formData = await request.formData()
        const file: File | null = formData.get('file') as unknown as File
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        const namaunik = Date.now() + '-' + file.name
        const publicpath = join(process.cwd(), 'public')
        const uploadPath = join(publicpath, 'upload', namaunik)
        await fsPromises.writeFile(uploadPath, buffer)

        await prisma.beritaTb.create({
            data: {
                judul: String(formData.get('judul')),
                tanggalBerita: String(formData.get('tanggalBerita')),
                isi: String(formData.get('isi')),
                karyawanId: Number(formData.get('karyawanId')),
                foto: namaunik,

            },
        })
        return NextResponse.json({ pesan: 'berhasil' })
    } finally {
        await prisma.$disconnect();
    }
}



export const GET = async (request: NextRequest) => {
    try {
        const jobdesk = await prisma.beritaTb.findMany({

            include: {
                KaryawanTb: true
            },
            orderBy: {
                createdAt: "desc"
            }
        });
        return NextResponse.json(jobdesk, { status: 200 })
    } finally {
        await prisma.$disconnect();
    }
}
