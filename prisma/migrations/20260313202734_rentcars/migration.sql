-- CreateTable
CREATE TABLE `User` (
    `user_id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NULL,
    `password` VARCHAR(191) NULL,
    `role` VARCHAR(191) NOT NULL DEFAULT 'user',
    `create_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `cust_id` INTEGER NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_cust_id_key`(`cust_id`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Car` (
    `plate_id` VARCHAR(191) NOT NULL,
    `brand` VARCHAR(191) NOT NULL,
    `model` VARCHAR(191) NOT NULL,
    `color` VARCHAR(191) NOT NULL,
    `mileage` INTEGER NOT NULL,
    `price_per_day` DECIMAL(10, 2) NOT NULL,
    `car_status` ENUM('AVAILABLE', 'RENTED', 'MAINTENANCE') NOT NULL DEFAULT 'AVAILABLE',
    `car_image` VARCHAR(191) NULL,
    `detial` VARCHAR(191) NULL,
    `type_id` INTEGER NOT NULL,

    PRIMARY KEY (`plate_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Car_type` (
    `type_id` INTEGER NOT NULL AUTO_INCREMENT,
    `type_name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`type_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Customer` (
    `cust_id` INTEGER NOT NULL AUTO_INCREMENT,
    `cust_fname` VARCHAR(191) NOT NULL,
    `cust_lname` VARCHAR(191) NOT NULL,
    `cust_tel` VARCHAR(191) NOT NULL,
    `license_num` VARCHAR(191) NOT NULL,
    `create_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`cust_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Payment` (
    `pay_id` INTEGER NOT NULL AUTO_INCREMENT,
    `rent_id` INTEGER NOT NULL,
    `pay_channel` ENUM('cash', 'transfer', 'credit_card') NOT NULL DEFAULT 'transfer',
    `pay_type` ENUM('deposit', 'rental_fee', 'credit_fine') NOT NULL DEFAULT 'deposit',
    `pay_amount` DECIMAL(10, 2) NOT NULL,
    `pay_date` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Payment_rent_id_key`(`rent_id`),
    PRIMARY KEY (`pay_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Rental` (
    `rent_id` INTEGER NOT NULL AUTO_INCREMENT,
    `car_id` VARCHAR(191) NOT NULL,
    `cust_id` INTEGER NOT NULL,
    `rent_date` DATETIME(3) NOT NULL,
    `return_due_date` DATETIME(3) NOT NULL,
    `actual_return_date` DATETIME(3) NOT NULL,
    `pickup_place` VARCHAR(191) NOT NULL,
    `deposit` DECIMAL(10, 2) NOT NULL,
    `rent_status` ENUM('pending', 'active', 'returned', 'cancelled') NOT NULL,
    `create_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`rent_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_cust_id_fkey` FOREIGN KEY (`cust_id`) REFERENCES `Customer`(`cust_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Car` ADD CONSTRAINT `Car_type_id_fkey` FOREIGN KEY (`type_id`) REFERENCES `Car_type`(`type_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_rent_id_fkey` FOREIGN KEY (`rent_id`) REFERENCES `Rental`(`rent_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Rental` ADD CONSTRAINT `Rental_car_id_fkey` FOREIGN KEY (`car_id`) REFERENCES `Car`(`plate_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Rental` ADD CONSTRAINT `Rental_cust_id_fkey` FOREIGN KEY (`cust_id`) REFERENCES `Customer`(`cust_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
