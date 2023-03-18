-- CreateEnum
CREATE TYPE "MessageSender" AS ENUM ('BOT', 'USER');

-- CreateTable
CREATE TABLE "NotesMessage" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "content" TEXT NOT NULL,
    "sender" "MessageSender" NOT NULL,
    "notesChatId" TEXT,

    CONSTRAINT "NotesMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotesChat" (
    "id" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "NotesChat_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NotesChat_userId_key" ON "NotesChat"("userId");

-- AddForeignKey
ALTER TABLE "NotesMessage" ADD CONSTRAINT "NotesMessage_notesChatId_fkey" FOREIGN KEY ("notesChatId") REFERENCES "NotesChat"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotesChat" ADD CONSTRAINT "NotesChat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
