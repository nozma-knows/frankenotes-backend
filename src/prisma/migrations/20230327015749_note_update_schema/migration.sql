/*
  Warnings:

  - You are about to drop the column `content` on the `Note` table. All the data in the column will be lost.
  - You are about to drop the `Test` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Note" DROP COLUMN "content",
ADD COLUMN     "editorState" TEXT NOT NULL DEFAULT '';

-- DropTable
DROP TABLE "Test";
