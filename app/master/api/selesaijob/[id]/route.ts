import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { createClient } from "@supabase/supabase-js"

const prisma = new PrismaClient()
const supabaseUrl = 'https://mxvdfimkvwoeqxlkycai.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14dmRmaW1rdndvZXF4bGt5Y2FpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDM0MzY0MjgsImV4cCI6MjAxOTAxMjQyOH0.MB60Xt9392SDM84HyhW8GQ31ShIirgptQasOYpJ2M-A'
const supabase = createClient(supabaseUrl, supabaseKey)

export const PATCH = async (request: Request, { params }: { params: { id: string } }) => {
    try {
        const formData = await request.formData()
        const ket = formData.get('keteranganAkhir')

        const file = formData.get('file') as File;
        const namaunik = Date.now() + '-' + file.name

        await supabase.storage
            .from('uploadfile')
            .upload(`file/${namaunik}`, file);


        const fileSuratTugas = formData.get('fileSurat') as File;
        const namaunikSurat = Date.now() + '-' + fileSuratTugas.name

        await supabase.storage
            .from('uploadfile')
            .upload(`file/${namaunikSurat}`, fileSuratTugas);


        const fileBeritaAcara = formData.get('fileBerita') as File;
        const namaunikBerita = Date.now() + '-' + fileBeritaAcara.name

        await supabase.storage
            .from('uploadfile')
            .upload(`file/${namaunikBerita}`, fileBeritaAcara);


        const fileAnggaran = formData.get('fileAnggaran') as File;
        const namaunikAnggaran = Date.now() + '-' + fileAnggaran.name

        await supabase.storage
            .from('uploadfile')
            .upload(`file/${namaunikAnggaran}`, fileAnggaran);

        await prisma.jobdeskTb.update({
            where: {
                id: Number(params.id)
            },
            data: {
                tanggalPelaksanaan: String(formData.get('tanggalkerja')),
                file: namaunik,
                suratTugas: namaunikSurat,
                beritaAcara: namaunikBerita,
                laporanAnggaran: namaunikAnggaran,
                status: "Selesai"
            }
        })

        if (ket === '') {
            await prisma.jobdeskTb.update({
                where: {
                    id: Number(params.id)
                },
                data: {
                    keteranganAkhir: "Tidak Ada"
                }
            })
        }
        else {
            await prisma.jobdeskTb.update({
                where: {
                    id: Number(params.id)
                },
                data: {
                    keteranganAkhir: String(formData.get('keteranganAkhir'))
                }
            })
        }
        return NextResponse.json({ status: 200, pesan: "berhasil" })
    } finally {
        await prisma.$disconnect();
    }
}
