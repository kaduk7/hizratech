import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import * as bcrypt from "bcrypt"
import { createClient } from "@supabase/supabase-js"


const prisma = new PrismaClient()
const supabaseUrl = 'https://mxvdfimkvwoeqxlkycai.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14dmRmaW1rdndvZXF4bGt5Y2FpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDM0MzY0MjgsImV4cCI6MjAxOTAxMjQyOH0.MB60Xt9392SDM84HyhW8GQ31ShIirgptQasOYpJ2M-A'
const supabase = createClient(supabaseUrl, supabaseKey)

export const PATCH = async (request: Request, { params }: { params: { id: string } }) => {
    try {
        const formData = await request.formData()
        const newpassword = formData.get('password')

        const cekhp = await prisma.karyawanTb.findMany({
            where: {
                hp: String(formData.get('hp')),
                NOT: {
                    id: Number(params.id)
                }
            }
        })

        const cekemail = await prisma.karyawanTb.findMany({
            where: {
                email: String(formData.get('email')),
                NOT: {
                    id: Number(params.id)
                }
            }
        })

        if (cekemail.length > 0) {
            return NextResponse.json({ status: 555, pesan: "sudah ada email" })
        }

        if (cekhp.length > 0) {
            return NextResponse.json({ status: 556, pesan: "sudah ada hp" })
        }

        await prisma.karyawanTb.update({
            where: {
                id: Number(params.id)
            },
            data: {
                nama: String(formData.get('nama')),
                tempatLahir: String(formData.get('tempatlahir')),
                tanggalLahir: String(formData.get('tanggallahir')),
                alamat: String(formData.get('alamat')),
                hp: String(formData.get('hp')),
                email: String(formData.get('email')),
                UserTb: {
                    update: {
                        usernama: String(formData.get('email')),
                    }
                },
            }
        })

        if (newpassword !== '') {
            await prisma.karyawanTb.update({
                where: {
                    id: Number(params.id)
                },
                data: {
                    UserTb: {
                        update: {
                            password: await bcrypt.hash(String(formData.get('password')), 10),
                        }
                    },
                }
            })
        }


        if (formData.get('newfoto') === 'yes') {

            const file = formData.get('file') as File;
            const namaunik = Date.now() + '-' + file.name

            const { data, error } = await supabase.storage
                .from('uploadfile')
                .upload(`foto-profil/${namaunik}`, file);

            if (error) {
                console.error('Gagal mengunggah file ke Supabase Storage', error);
                return NextResponse.json({ pesan: 'Gagal mengunggah file' }, { status: 500 });
            }

            await prisma.karyawanTb.update({
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



export const GET = async (request: Request, { params }: { params: { id: string } }) => {
    try {
        const karyawan = await prisma.karyawanTb.findMany({
            where: {
                divisiId: Number(params.id)
            },
            orderBy: {
                id: "asc"
            }
        });
        return NextResponse.json(karyawan, { status: 200 })
    } finally {
        await prisma.$disconnect();
    }
}

export const DELETE = async (request: Request, { params }: { params: { id: string } }) => {
    try {
        const karyawan = await prisma.karyawanTb.delete({
            where: {
                id: Number(params.id)
            }
        })
        return NextResponse.json(karyawan, { status: 200 })
    } finally {
        await prisma.$disconnect();
    }
}