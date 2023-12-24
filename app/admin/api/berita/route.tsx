import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { createClient } from "@supabase/supabase-js"


const prisma = new PrismaClient()
const supabaseUrl = 'https://mxvdfimkvwoeqxlkycai.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14dmRmaW1rdndvZXF4bGt5Y2FpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDM0MzY0MjgsImV4cCI6MjAxOTAxMjQyOH0.MB60Xt9392SDM84HyhW8GQ31ShIirgptQasOYpJ2M-A'
const supabase = createClient(supabaseUrl, supabaseKey)

export const POST = async (request: Request) => {
    try {
        const formData = await request.formData();
        
        const file = formData.get('file') as File;
        const namaunik = Date.now() + '-' + file.name

        const { data, error } = await supabase.storage
            .from('uploadfile')
            .upload(`berita-images/${namaunik}`, file);

        if (error) {
            console.error('Gagal mengunggah file ke Supabase Storage', error);
            return NextResponse.json({ pesan: 'Gagal mengunggah file' }, { status: 500 });
        }


        await prisma.beritaTb.create({
            data: {
                judul: String(formData.get('judul')),
                tanggalBerita: String(formData.get('tanggalBerita')),
                isi: String(formData.get('isi')),
                karyawanId: Number(formData.get('karyawanId')),
                foto: namaunik,
            },
        });

        return NextResponse.json({ pesan: 'berhasil' })
    } finally {
        await prisma.$disconnect();
    }
};



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
