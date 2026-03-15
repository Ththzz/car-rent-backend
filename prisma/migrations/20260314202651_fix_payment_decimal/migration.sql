/*
  Warnings:

  - You are about to drop the column `detial` on the `car` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `car` DROP COLUMN `detial`,
    ADD COLUMN `detail` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `rental` MODIFY `actual_return_date` DATETIME(3) NULL;
