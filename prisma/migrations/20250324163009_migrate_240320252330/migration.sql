-- CreateEnum
CREATE TYPE "role_user" AS ENUM ('admmin', 'customer');

-- CreateEnum
CREATE TYPE "status_order" AS ENUM ('belum_digunakan', 'digunakan', 'expired');

-- CreateEnum
CREATE TYPE "status_pembayaran" AS ENUM ('pending', 'gagal', 'berhasil');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "status" INTEGER NOT NULL,
    "role" "role_user" NOT NULL DEFAULT 'customer',

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "token" TEXT,

    CONSTRAINT "auth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kategori" (
    "id" SERIAL NOT NULL,
    "nama_kategori" TEXT NOT NULL,

    CONSTRAINT "kategori_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "acara" (
    "id" SERIAL NOT NULL,
    "nama_acara" TEXT NOT NULL,
    "waktu_acara" TIMESTAMPTZ(3) NOT NULL,
    "kategori_id" INTEGER,
    "deskripsi" TEXT NOT NULL,
    "banner_img" TEXT NOT NULL,
    "map_tiket_img" TEXT,

    CONSTRAINT "acara_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tiket_acara" (
    "id" SERIAL NOT NULL,
    "acara_id" INTEGER NOT NULL,
    "tipe_tiket" TEXT NOT NULL,
    "kuota" INTEGER NOT NULL,
    "tiket_terjual" INTEGER NOT NULL,
    "harga_tiket" INTEGER NOT NULL,

    CONSTRAINT "tiket_acara_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pemesanan" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "kode_pemesanan" TEXT NOT NULL,
    "status_pembayaran" "status_pembayaran" NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pemesanan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" SERIAL NOT NULL,
    "pemesanan_id" INTEGER NOT NULL,
    "tiket_acara_id" INTEGER NOT NULL,
    "kode_order" TEXT NOT NULL,
    "status" "status_order" NOT NULL DEFAULT 'belum_digunakan',
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "auth" ADD CONSTRAINT "auth_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "acara" ADD CONSTRAINT "acara_kategori_id_fkey" FOREIGN KEY ("kategori_id") REFERENCES "kategori"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tiket_acara" ADD CONSTRAINT "tiket_acara_acara_id_fkey" FOREIGN KEY ("acara_id") REFERENCES "acara"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pemesanan" ADD CONSTRAINT "pemesanan_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_tiket_acara_id_fkey" FOREIGN KEY ("tiket_acara_id") REFERENCES "tiket_acara"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_pemesanan_id_fkey" FOREIGN KEY ("pemesanan_id") REFERENCES "pemesanan"("id") ON DELETE CASCADE ON UPDATE CASCADE;
