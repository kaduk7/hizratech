import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import * as bcrypt from "bcrypt"

const prisma = new PrismaClient()

export const POST = async (request: Request) => {

    const formData = await request.formData()

    await prisma.karyawanTb.create({
        data: {
            nama: String(formData.get('nama')),
            hp: String(formData.get('hp')),
            email: String(formData.get('email')),
            divisiId: Number(formData.get('divisiId')),
            UserTb: {
                create: {
                    usernama: String(formData.get('email')),
                    password: await bcrypt.hash(String(formData.get('password')), 10),
                    status: String(formData.get('namadivisi'))
                }
            },
            HakAksesTb: {
                create: {
                    datakaryawan: String(formData.get('karyawanCekValue')),
                    informasi: String(formData.get('informasiCekValue')),
                    jobdesk: String(formData.get('jobdeskCekValue')),
                }
            }
        },
        include: {
            UserTb: true
        }
    })
    return NextResponse.json({ pesan: 'berhasil' })

}

export const GET = async () => {
    const karyawan = await prisma.karyawanTb.findMany({
        include: {
            DivisiTb: true,
            HakAksesTb: true,
        },
        orderBy: {
            id: "asc"
        }
    });
    return NextResponse.json(karyawan, { status: 200 })

}