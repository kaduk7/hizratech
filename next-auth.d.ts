import { NextAuth } from 'next-auth';

declare module "next-auth"{
    interface Session {
        id: Number;
        usernama: String,
        nama: String,
        sekolahId: Number,
        namasekolah: Number,
        status: string;
        divisiId: Number;
        namaDivisi:String;
        karyawanId:Number;
        hakAksesDatakaryawan:String,
        hakAksesInformasi:String,
        hakAksesJobdesk: String,
    }
}

