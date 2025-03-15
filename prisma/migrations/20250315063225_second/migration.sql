/*
  Warnings:

  - You are about to drop the column `festStage` on the `festTB` table. All the data in the column will be lost.
  - You are about to drop the column `userFullName` on the `userTB` table. All the data in the column will be lost.
  - Added the required column `festState` to the `festTB` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userFullname` to the `userTB` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `festTB` DROP COLUMN `festStage`,
    ADD COLUMN `festState` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `userTB` DROP COLUMN `userFullName`,
    ADD COLUMN `userFullname` VARCHAR(100) NOT NULL;
