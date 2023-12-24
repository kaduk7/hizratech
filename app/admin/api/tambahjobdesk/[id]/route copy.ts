import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { join } from "path"
import { promises as fsPromises } from "fs"

const prisma = new PrismaClient()

export const PATCH = async (request: Request, { params }: { params: { id: string } }) => {
    try {
        const formData = await request.formData()
        const team = formData.getAll('team').map(String);
        const newsurat = formData.get('newsurat')
        const newberita = formData.get('newberita')
        const newanggaran = formData.get('newanggaran')

        await prisma.jobdeskTb.update({
            where: {
                id: Number(params.id)
            },
            data: {
                namaJob: String(formData.get('namaJob')),
                keterangan: String(formData.get('keterangan')),
                tanggalMulai: String(formData.get('tanggalMulai')),
                deadline: String(formData.get('deadline')),
                karyawanId: Number(formData.get('karyawanId')),
                team: team.join(', '),
                namaTeam: String(formData.get('namaterpilih')),
                status: String(formData.get('status')),
            }
        })

        if (newsurat === 'yes') {
            const fileSuratTugas: File | null = formData.get('fileSuratTugas') as unknown as File
            const publicpath = join(process.cwd(), 'public')
            const bytesSurat = await fileSuratTugas.arrayBuffer()
            const bufferSurat = Buffer.from(bytesSurat)
            const namaunikSurat = Date.now() + '-' + fileSuratTugas.name
            const uploadPathSurat = join(publicpath, 'upload', namaunikSurat)
            await fsPromises.writeFile(uploadPathSurat, bufferSurat)
            await prisma.jobdeskTb.update({
                where: {
                    id: Number(params.id)
                },
                data: {
                    suratTugas: namaunikSurat,
                }
            })
        }

        if (newberita === 'yes') {
            const fileBeritaAcara: File | null = formData.get('fileBeritaAcara') as unknown as File
            const publicpath = join(process.cwd(), 'public')
            const bytesBerita = await fileBeritaAcara.arrayBuffer()
            const bufferBerita = Buffer.from(bytesBerita)
            const namaunikBerita = Date.now() + '-' + fileBeritaAcara.name
            const uploadPathBerita = join(publicpath, 'upload', namaunikBerita)
            await fsPromises.writeFile(uploadPathBerita, bufferBerita)
            await prisma.jobdeskTb.update({
                where: {
                    id: Number(params.id)
                },
                data: {
                    beritaAcara: namaunikBerita,
                }
            })
        }

        if (newanggaran === 'yes') {
            const fileAnggaran: File | null = formData.get('fileAnggaran') as unknown as File
            const publicpath = join(process.cwd(), 'public')
            const bytesAnggaran = await fileAnggaran.arrayBuffer()
            const bufferAnggaran = Buffer.from(bytesAnggaran)
            const namaunikAnggaran = Date.now() + '-' + fileAnggaran.name
            const uploadPathAnggaran = join(publicpath, 'upload', namaunikAnggaran)
            await fsPromises.writeFile(uploadPathAnggaran, bufferAnggaran)
            await prisma.jobdeskTb.update({
                where: {
                    id: Number(params.id)
                },
                data: {
                    laporanAnggaran: namaunikAnggaran,
                }
            })
        }
        return NextResponse.json({ status: 200, pesan: "berhasil" })
    } finally {
        await prisma.$disconnect();
    }
}



export const DELETE = async (request: Request, { params }: { params: { id: string } }) => {
    try {
        const jobdesk = await prisma.jobdeskTb.delete({
            where: {
                id: Number(params.id)
            }
        })
        return NextResponse.json(jobdesk, { status: 200 })
    } finally {
        await prisma.$disconnect();
    }
}

export const GET = async (request: Request, { params }: { params: { id: string } }) => {
    try {
        const requestjobdesk = await prisma.jobdeskTb.findMany({
            where: {
                karyawanId: Number(params.id)
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
