import nextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import * as bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { NextAuthOptions } from "next-auth";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {

  providers: [
    CredentialsProvider({
      name: 'Sign in',
      credentials: {
        username: {
          label: 'Usernama',
          type: 'text',
          placeholder: 'Usernama'
        },
        password: {
          label: 'Password',
          type: 'password',
          placeholder: 'Password'
        }
      },

      async authorize(credentials) {
        if (!credentials?.username || !credentials.password) {
          return null
        }

        const user = await prisma.userTb.findUnique({
          where: {
            usernama: credentials.username
          },
          include: {
            KaryawanTb: {
              include:{
                DivisiTb:true,
                HakAksesTb:true,
              }
            },
            
          }
        })

        if (!user) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id + '',
          usernama: user.usernama,
          nama: user.KaryawanTb.nama,
          karyawanId:user.karyawanId,
          status: user.status,
          hp: user.KaryawanTb.hp,
          divisiId:user.KaryawanTb.divisiId,
          namaDivisi:user.KaryawanTb.DivisiTb.nama,
          hakAksesDatakaryawan: user.KaryawanTb?.HakAksesTb?.datakaryawan,
          hakAksesInformasi: user.KaryawanTb?.HakAksesTb?.informasi,
          hakAksesJobdesk: user.KaryawanTb?.HakAksesTb?.jobdesk,
        } as any;
      }
    })
  ],

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user }
    },

    async session({ session, token }) {
      session = token as any;
      return session;
    },

  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 20,
    updateAge: 60 * 20,
  },
}

