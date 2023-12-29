import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { createClient } from "@supabase/supabase-js"
import { supabase, supabaseBUCKET } from "@/app/helper"

const prisma = new PrismaClient()

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
            await prisma.beritaTb.update({
                where: {
                    id: Number(params.id)
                },
                data: {
                    foto: String(formData.get('namaunik')),
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

