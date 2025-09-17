/*
  Warnings:

  - You are about to drop the column `entityId` on the `auditlog` table. All the data in the column will be lost.
  - You are about to drop the column `meta` on the `auditlog` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `auditlog` DROP COLUMN `entityId`,
    DROP COLUMN `meta`,
    ADD COLUMN `note` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `reservation` ADD COLUMN `checkInVerified` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `digitalKeyIssued` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `idScanUrl` VARCHAR(191) NULL,
    ADD COLUMN `walkIn` BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE `QueueTicket` (
    `id` VARCHAR(191) NOT NULL,
    `guestName` VARCHAR(191) NOT NULL,
    `purpose` VARCHAR(191) NOT NULL DEFAULT 'checkin',
    `status` VARCHAR(191) NOT NULL DEFAULT 'waiting',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
