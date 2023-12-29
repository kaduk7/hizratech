import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { supabase } from "@/app/helper"

const prisma = new PrismaClient()

export const PATCH = async (request: Request, { params }: { params: { id: string } }) => {
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
        // const fileSuratTugas = formData.get('fileSuratTugas') as File;
        // const namaunikSurat = Date.now() + '-' + fileSuratTugas.name

        // await supabase.storage
        //     .from('uploadfile')
        //     .upload(`file/${namaunikSurat}`, fileSuratTugas);

        await prisma.jobdeskTb.update({
            where: {
                id: Number(params.id)
            },
            data: {
                suratTugas: String(formData.get('namaunikSurat')),
            }
        })
    }

    if (newberita === 'yes') {
        // const fileBeritaAcara = formData.get('fileBeritaAcara') as File;
        // const namaunikBerita = Date.now() + '-' + fileBeritaAcara.name

        // await supabase.storage
        //     .from('uploadfile')
        //     .upload(`file/${namaunikBerita}`, fileBeritaAcara);

        await prisma.jobdeskTb.update({
            where: {
                id: Number(params.id)
            },
            data: {
                beritaAcara: String(formData.get('namaunikBerita')),
            }
        })
    }

    if (newanggaran === 'yes') {
        // const fileAnggaran = formData.get('fileAnggaran') as File;
        // const namaunikAnggaran = Date.now() + '-' + fileAnggaran.name

        // await supabase.storage
        //     .from('uploadfile')
        //     .upload(`file/${namaunikAnggaran}`, fileAnggaran);

        await prisma.jobdeskTb.update({
            where: {
                id: Number(params.id)
            },
            data: {
                laporanAnggaran: String(formData.get('namaunikAnggaran')),
            }
        })
    }
    return NextResponse.json({ status: 200, pesan: "berhasil" })
}

export const DELETE = async (request: Request, { params }: { params: { id: string } }) => {
    const jobdesk = await prisma.jobdeskTb.delete({
        where: {
            id: Number(params.id)
        }
    })
    return NextResponse.json(jobdesk, { status: 200 })
}

export const GET = async (request: Request, { params }: { params: { id: string } }) => {
    const requestjobdesk = await prisma.jobdeskTb.findMany({
        where: {
            karyawanId: Number(params.id)
        },
        include: {
            KaryawanTb: true
        }
    });
    return NextResponse.json(requestjobdesk, { status: 200 })
}
