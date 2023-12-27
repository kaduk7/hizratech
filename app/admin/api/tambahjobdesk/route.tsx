import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { createClient } from "@supabase/supabase-js"

const prisma = new PrismaClient()
const supabaseUrl = 'https://mxvdfimkvwoeqxlkycai.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14dmRmaW1rdndvZXF4bGt5Y2FpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDM0MzY0MjgsImV4cCI6MjAxOTAxMjQyOH0.MB60Xt9392SDM84HyhW8GQ31ShIirgptQasOYpJ2M-A'
const supabase = createClient(supabaseUrl, supabaseKey)

export const POST = async (request: Request) => {
    try {
        const formData = await request.formData()
        const team = formData.getAll('team').map(String);


        const fileSuratTugas = formData.get('fileSuratTugas') as File;
        const namaunikSurat = Date.now() + '-' + fileSuratTugas.name

        await supabase.storage
            .from('uploadfile')
            .upload(`file/${namaunikSurat}`, fileSuratTugas);


        const fileBeritaAcara = formData.get('fileBeritaAcara') as File;
        const namaunikBerita = Date.now() + '-' + fileBeritaAcara.name

        await supabase.storage
            .from('uploadfile')
            .upload(`file/${namaunikBerita}`, fileBeritaAcara);


        const fileAnggaran = formData.get('fileAnggaran') as File;
        const namaunikAnggaran = Date.now() + '-' + fileAnggaran.name

        await supabase.storage
            .from('uploadfile')
            .upload(`file/${namaunikAnggaran}`, fileAnggaran);


        await prisma.jobdeskTb.create({
            data: {
                namaJob: String(formData.get('namaJob')),
                keterangan: String(formData.get('keterangan')),
                tanggalMulai: String(formData.get('tanggalMulai')),
                deadline: String(formData.get('deadline')),
                karyawanId: Number(formData.get('karyawanId')),
                team: team.join(', '),
                namaTeam: String(formData.get('namaterpilih')),
                status: String(formData.get('status')),
                suratTugas: namaunikSurat,
                beritaAcara: namaunikBerita,
                laporanAnggaran: namaunikAnggaran,
            },
        })
        return NextResponse.json({ pesan: 'berhasil' })
    } finally {
        await prisma.$disconnect();
    }
}

export const GET = async () => {
    try {
        const jobdesk = await prisma.jobdeskTb.findMany({

            include: {
                KaryawanTb: true
            },
            orderBy: {
                id: "asc"
            }
        });
        return NextResponse.json(jobdesk, { status: 200 })
    } finally {
    }
}
