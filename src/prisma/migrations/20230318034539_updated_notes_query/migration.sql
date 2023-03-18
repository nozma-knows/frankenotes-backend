/*
  Warnings:

  - You are about to drop the `NotesChat` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `NotesMessage` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "NotesQueryStatus" AS ENUM ('PENDING', 'SUCCESSFUL', 'ERROR');

-- DropForeignKey
ALTER TABLE "NotesChat" DROP CONSTRAINT "NotesChat_userId_fkey";

-- DropForeignKey
ALTER TABLE "NotesMessage" DROP CONSTRAINT "NotesMessage_notesChatId_fkey";

-- DropTable
DROP TABLE "NotesChat";

-- DropTable
DROP TABLE "NotesMessage";

-- DropEnum
DROP TYPE "MessageSender";

-- CreateTable
CREATE TABLE "NotesQuery" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "authorId" TEXT NOT NULL,
    "query" TEXT NOT NULL,
    "response" TEXT NOT NULL,
    "status" "NotesQueryStatus" NOT NULL,

    CONSTRAINT "NotesQuery_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "NotesQuery" ADD CONSTRAINT "NotesQuery_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
