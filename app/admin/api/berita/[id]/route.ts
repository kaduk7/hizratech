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
        const newfoto = formData.get('newfoto')

        await prisma.beritaTb.update({
            where: {
                id: Number(params.id)
            },
            data: {
                judul: String(formData.get('judul')),
                tanggalBerita: String(formData.get('tanggalBerita')),
                isi: String(formData.get('isi')),
            }
        })

        if (newfoto === 'yes') {
            const file = formData.get('file') as File;
            const namaunik = Date.now() + '-' + file.name

            const { data, error } = await supabase.storage
                .from('uploadfile')
                .upload(`berita-images/${namaunik}`, file);

            if (error) {
                console.error('Gagal mengunggah file ke Supabase Storage', error);
                return NextResponse.json({ pesan: 'Gagal mengunggah file' }, { status: 500 });
            }

            await prisma.beritaTb.update({
                where: {
                    id: Number(params.id)
                },
                data: {
                    foto: namaunik,
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
        const berita = await prisma.beritaTb.delete({
            where: {
                id: Number(params.id)
            }
        })
        return NextResponse.json(berita, { status: 200 })

    } finally {
        await prisma.$disconnect();
    }
}

