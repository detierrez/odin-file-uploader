/*
  Warnings:

  - You are about to drop the column `ownerId` on the `Folder` table. All the data in the column will be lost.
  - Added the required column `rootFolderId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Folder" DROP CONSTRAINT "Folder_ownerId_fkey";

-- AlterTable
ALTER TABLE "Folder" DROP COLUMN "ownerId";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "rootFolderId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_rootFolderId_fkey" FOREIGN KEY ("rootFolderId") REFERENCES "Folder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
