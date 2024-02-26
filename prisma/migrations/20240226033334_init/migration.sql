-- CreateTable
CREATE TABLE "DivisiTb" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DivisiTb_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KaryawanTb" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "tempatLahir" TEXT,
    "tanggalLahir" TIMESTAMP(3),
    "alamat" TEXT,
    "hp" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "divisiId" INTEGER NOT NULL,
    "foto" TEXT,
    "ktp" TEXT,
    "CV" TEXT,
    "ijazah" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KaryawanTb_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobdeskTb" (
    "id" SERIAL NOT NULL,
    "karyawanId" INTEGER NOT NULL,
    "namaJob" TEXT NOT NULL,
    "keterangan" TEXT NOT NULL,
    "tanggalMulai" TIMESTAMP(3) NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,
    "team" TEXT NOT NULL,
    "namaTeam" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "rincian" TEXT NOT NULL,
    "suratTugas" TEXT NOT NULL,
    "beritaAcara" TEXT NOT NULL,
    "laporanAnggaran" TEXT NOT NULL,
    "tanggalPelaksanaan" TIMESTAMP(3),
    "file" TEXT,
    "alasan" TEXT,
    "keteranganAkhir" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobdeskTb_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RincianJobdeskTb" (
    "id" SERIAL NOT NULL,
    "jobdeskId" INTEGER NOT NULL,
    "judul" TEXT NOT NULL,
    "keterangan" TEXT NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RincianJobdeskTb_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RequestJobdeskTb" (
    "id" SERIAL NOT NULL,
    "karyawanId" INTEGER NOT NULL,
    "namaJob" TEXT NOT NULL,
    "keterangan" TEXT NOT NULL,
    "tanggalMulai" TIMESTAMP(3) NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,
    "rincian" TEXT NOT NULL,
    "team" TEXT NOT NULL,
    "namaTeam" TEXT NOT NULL,
    "alasan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RequestJobdeskTb_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BeritaTb" (
    "id" SERIAL NOT NULL,
    "judul" TEXT NOT NULL,
    "tanggalBerita" TIMESTAMP(3) NOT NULL,
    "isi" TEXT NOT NULL,
    "foto" TEXT,
    "karyawanId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BeritaTb_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KomentarTb" (
    "id" SERIAL NOT NULL,
    "beritaId" INTEGER NOT NULL,
    "karyawanId" INTEGER NOT NULL,
    "isi" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KomentarTb_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PengumumanTb" (
    "id" SERIAL NOT NULL,
    "judul" TEXT NOT NULL,
    "tanggalPengumuman" TIMESTAMP(3) NOT NULL,
    "isi" TEXT NOT NULL,
    "foto" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PengumumanTb_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PengumumanDivisiTb" (
    "id" SERIAL NOT NULL,
    "pengumumanId" INTEGER NOT NULL,
    "divisiId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PengumumanDivisiTb_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserTb" (
    "id" SERIAL NOT NULL,
    "karyawanId" INTEGER NOT NULL,
    "usernama" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserTb_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HakAksesTb" (
    "id" SERIAL NOT NULL,
    "karyawanId" INTEGER NOT NULL,
    "datakaryawan" TEXT NOT NULL,
    "informasi" TEXT NOT NULL,
    "jobdesk" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HakAksesTb_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "KaryawanTb_hp_key" ON "KaryawanTb"("hp");

-- CreateIndex
CREATE UNIQUE INDEX "KaryawanTb_email_key" ON "KaryawanTb"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserTb_karyawanId_key" ON "UserTb"("karyawanId");

-- CreateIndex
CREATE UNIQUE INDEX "UserTb_usernama_key" ON "UserTb"("usernama");

-- CreateIndex
CREATE UNIQUE INDEX "HakAksesTb_karyawanId_key" ON "HakAksesTb"("karyawanId");

-- AddForeignKey
ALTER TABLE "KaryawanTb" ADD CONSTRAINT "KaryawanTb_divisiId_fkey" FOREIGN KEY ("divisiId") REFERENCES "DivisiTb"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobdeskTb" ADD CONSTRAINT "JobdeskTb_karyawanId_fkey" FOREIGN KEY ("karyawanId") REFERENCES "KaryawanTb"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RincianJobdeskTb" ADD CONSTRAINT "RincianJobdeskTb_jobdeskId_fkey" FOREIGN KEY ("jobdeskId") REFERENCES "JobdeskTb"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestJobdeskTb" ADD CONSTRAINT "RequestJobdeskTb_karyawanId_fkey" FOREIGN KEY ("karyawanId") REFERENCES "KaryawanTb"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BeritaTb" ADD CONSTRAINT "BeritaTb_karyawanId_fkey" FOREIGN KEY ("karyawanId") REFERENCES "KaryawanTb"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KomentarTb" ADD CONSTRAINT "KomentarTb_beritaId_fkey" FOREIGN KEY ("beritaId") REFERENCES "BeritaTb"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KomentarTb" ADD CONSTRAINT "KomentarTb_karyawanId_fkey" FOREIGN KEY ("karyawanId") REFERENCES "KaryawanTb"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PengumumanDivisiTb" ADD CONSTRAINT "PengumumanDivisiTb_divisiId_fkey" FOREIGN KEY ("divisiId") REFERENCES "DivisiTb"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PengumumanDivisiTb" ADD CONSTRAINT "PengumumanDivisiTb_pengumumanId_fkey" FOREIGN KEY ("pengumumanId") REFERENCES "PengumumanTb"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTb" ADD CONSTRAINT "UserTb_karyawanId_fkey" FOREIGN KEY ("karyawanId") REFERENCES "KaryawanTb"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HakAksesTb" ADD CONSTRAINT "HakAksesTb_karyawanId_fkey" FOREIGN KEY ("karyawanId") REFERENCES "KaryawanTb"("id") ON DELETE CASCADE ON UPDATE CASCADE;
