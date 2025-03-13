-- CreateTable
CREATE TABLE `userTB` (
    `userId` INTEGER NOT NULL AUTO_INCREMENT,
    `userFullName` VARCHAR(100) NOT NULL,
    `userName` VARCHAR(50) NOT NULL,
    `userPassword` VARCHAR(50) NOT NULL,
    `userImage` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `festTB` (
    `festId` INTEGER NOT NULL AUTO_INCREMENT,
    `festName` VARCHAR(150) NOT NULL,
    `festDetail` VARCHAR(191) NOT NULL,
    `festStage` VARCHAR(191) NOT NULL,
    `festNumDay` INTEGER NOT NULL,
    `festCost` DOUBLE NOT NULL,
    `userId` INTEGER NOT NULL,
    `festImage` VARCHAR(150) NOT NULL,

    PRIMARY KEY (`festId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
