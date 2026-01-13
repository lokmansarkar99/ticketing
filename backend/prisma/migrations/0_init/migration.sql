-- CreateTable
CREATE TABLE `ForgetOTP` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `token` TEXT NOT NULL,
    `userName` VARCHAR(191) NOT NULL,
    `otp` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AboutUs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `image` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PartialInfo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `counterBookingTime` VARCHAR(191) NOT NULL DEFAULT '1 Hour',
    `partialPercentage` INTEGER NOT NULL,
    `time` VARCHAR(191) NOT NULL DEFAULT '2 Hours',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userName` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `password` VARCHAR(191) NOT NULL,
    `roleId` INTEGER NOT NULL,
    `counterId` INTEGER NOT NULL,
    `contactNo` VARCHAR(191) NULL DEFAULT 'N/A',
    `address` VARCHAR(191) NULL DEFAULT 'N/A',
    `dateOfBirth` VARCHAR(191) NULL DEFAULT 'N/A',
    `gender` ENUM('Male', 'Female') NULL DEFAULT 'Male',
    `maritalStatus` ENUM('Married', 'Unmarried') NULL DEFAULT 'Married',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `bloodGroup` VARCHAR(191) NULL DEFAULT 'N/A',
    `count` INTEGER NOT NULL DEFAULT 0,
    `blockDate` DATETIME(3) NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `avatar` VARCHAR(191) NOT NULL DEFAULT 'https://res.cloudinary.com/droyjiqwf/image/upload/v1696801827/download_d6s8bi.jpg',

    UNIQUE INDEX `User_userName_key`(`userName`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FundPrepaid` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `paymentType` ENUM('NAGAD', 'CHEQUE', 'CASH', 'BKASH') NOT NULL,
    `status` ENUM('Pending', 'Verified', 'Cancelled') NOT NULL DEFAULT 'Pending',
    `txId` VARCHAR(191) NOT NULL,
    `amount` INTEGER NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CoachAssignToCounterMaster` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `counterId` INTEGER NOT NULL,
    `day` INTEGER NOT NULL,
    `hour` INTEGER NOT NULL,
    `minute` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `CoachAssignToCounterMaster_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BookingRoutePermission` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `coachAssignId` INTEGER NOT NULL,
    `routeId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SellingRoutePermission` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `coachAssignId` INTEGER NOT NULL,
    `routeId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PermissionUser` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `board` BOOLEAN NOT NULL,
    `aifs` BOOLEAN NOT NULL DEFAULT true,
    `canViewAllCoachInvoice` BOOLEAN NOT NULL,
    `bookingPermission` BOOLEAN NOT NULL,
    `ticketCancel` BOOLEAN NOT NULL,
    `seatTransfer` BOOLEAN NOT NULL,
    `coachActiveInActive` BOOLEAN NOT NULL,
    `blockDiscount` BOOLEAN NOT NULL,
    `showDiscountMenu` BOOLEAN NOT NULL,
    `showDiscountFromDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `showDiscountEndDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `vipSeatAllowToSale` BOOLEAN NOT NULL,
    `showOwnCounterBoardingPoint` BOOLEAN NOT NULL DEFAULT false,
    `showOwnCounterSalesInTripSheet` BOOLEAN NOT NULL DEFAULT false,
    `isPrepaid` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `PermissionUser_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Driver` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `referenceBy` VARCHAR(191) NOT NULL DEFAULT 'N/A',
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL DEFAULT 'N/A',
    `contactNo` VARCHAR(191) NOT NULL,
    `emergencyNumber` VARCHAR(191) NOT NULL DEFAULT 'N/A',
    `address` VARCHAR(191) NULL DEFAULT 'N/A',
    `dateOfBirth` VARCHAR(191) NULL DEFAULT 'N/A',
    `gender` ENUM('Male', 'Female') NULL DEFAULT 'Male',
    `maritalStatus` ENUM('Married', 'Unmarried') NULL DEFAULT 'Married',
    `licenseNumber` VARCHAR(191) NOT NULL DEFAULT 'N/A',
    `licenseIssueDate` VARCHAR(191) NOT NULL DEFAULT 'N/A',
    `licenseExpDate` VARCHAR(191) NOT NULL DEFAULT 'N/A',
    `licensePhoto` VARCHAR(191) NOT NULL DEFAULT 'N/A',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `bloodGroup` VARCHAR(191) NULL DEFAULT 'N/A',
    `active` BOOLEAN NOT NULL DEFAULT true,
    `avatar` VARCHAR(191) NOT NULL DEFAULT 'https://res.cloudinary.com/droyjiqwf/image/upload/v1696801827/download_d6s8bi.jpg',

    UNIQUE INDEX `Driver_contactNo_key`(`contactNo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Helper` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `referenceBy` VARCHAR(191) NOT NULL DEFAULT 'N/A',
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL DEFAULT 'N/A',
    `contactNo` VARCHAR(191) NOT NULL,
    `emergencyNumber` VARCHAR(191) NOT NULL DEFAULT 'N/A',
    `address` VARCHAR(191) NULL DEFAULT 'N/A',
    `dateOfBirth` VARCHAR(191) NULL DEFAULT 'N/A',
    `gender` ENUM('Male', 'Female') NULL DEFAULT 'Male',
    `maritalStatus` ENUM('Married', 'Unmarried') NULL DEFAULT 'Married',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `bloodGroup` VARCHAR(191) NULL DEFAULT 'N/A',
    `active` BOOLEAN NOT NULL DEFAULT true,
    `avatar` VARCHAR(191) NOT NULL DEFAULT 'https://res.cloudinary.com/droyjiqwf/image/upload/v1696801827/download_d6s8bi.jpg',

    UNIQUE INDEX `Helper_contactNo_key`(`contactNo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Role` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Role_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SeatPlan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `noOfSeat` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `SeatPlan_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Bus` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `image` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Coach` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `coachNo` VARCHAR(191) NOT NULL,
    `schedule` VARCHAR(191) NOT NULL,
    `routeId` INTEGER NOT NULL,
    `fromCounterId` INTEGER NOT NULL,
    `destinationCounterId` INTEGER NOT NULL,
    `seatPlanId` INTEGER NOT NULL,
    `coachClass` ENUM('B_Class', 'E_Class', 'S_Class', 'Sleeper') NOT NULL DEFAULT 'E_Class',
    `coachType` VARCHAR(191) NOT NULL DEFAULT 'AC',
    `type` VARCHAR(191) NOT NULL DEFAULT 'Daily',
    `holdingTime` VARCHAR(191) NULL DEFAULT 'N/A',
    `fareAllowed` VARCHAR(191) NULL DEFAULT 'N/A',
    `vipTimeOut` VARCHAR(191) NULL DEFAULT 'N/A',
    `active` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Coach_coachNo_key`(`coachNo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CoachViaRoute` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `coachId` INTEGER NOT NULL,
    `counterId` INTEGER NOT NULL,
    `isBoardingPoint` BOOLEAN NOT NULL,
    `isDroppingPoint` BOOLEAN NOT NULL,
    `boardingTime` VARCHAR(191) NULL,
    `droppingTime` VARCHAR(191) NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Counter` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` ENUM('Own_Counter', 'Commission_Counter', 'Head_Office') NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `landMark` VARCHAR(191) NULL DEFAULT 'N/A',
    `locationUrl` VARCHAR(191) NULL DEFAULT 'N/A',
    `phone` VARCHAR(191) NULL,
    `mobile` VARCHAR(191) NOT NULL,
    `fax` VARCHAR(191) NULL DEFAULT 'N/A',
    `email` VARCHAR(191) NULL,
    `primaryContactPersonName` VARCHAR(191) NOT NULL,
    `country` VARCHAR(191) NOT NULL DEFAULT 'Bangladesh',
    `stationId` INTEGER NOT NULL,
    `status` BOOLEAN NOT NULL,
    `balance` DOUBLE NOT NULL DEFAULT 0,
    `bookingAllowStatus` ENUM('Coach_Wish', 'Route_Wish', 'Total') NOT NULL DEFAULT 'Coach_Wish',
    `bookingAllowClass` ENUM('B_Class', 'E_Class', 'S_Class', 'Sleeper') NOT NULL DEFAULT 'B_Class',
    `zone` VARCHAR(191) NULL DEFAULT 'N/A',
    `isSmsSend` BOOLEAN NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `commissionType` ENUM('Fixed', 'Percentage') NOT NULL DEFAULT 'Fixed',
    `commission` INTEGER NOT NULL DEFAULT 0,

    UNIQUE INDEX `Counter_mobile_key`(`mobile`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Station` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `isSegment` BOOLEAN NOT NULL DEFAULT false,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Route` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `routeType` ENUM('Local', 'International') NOT NULL DEFAULT 'Local',
    `routeDirection` ENUM('Up_Way', 'Down_Way') NOT NULL DEFAULT 'Up_Way',
    `kilo` INTEGER NULL,
    `isPassengerInfoRequired` BOOLEAN NOT NULL DEFAULT false,
    `via` VARCHAR(191) NULL,
    `routeName` VARCHAR(191) NOT NULL,
    `from` INTEGER NOT NULL,
    `middle` INTEGER NULL,
    `to` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `viaRoute` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `routeId` INTEGER NOT NULL,
    `stationId` INTEGER NOT NULL,
    `schedule` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Segment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `routeId` INTEGER NOT NULL,
    `type` VARCHAR(191) NOT NULL DEFAULT 'AC',
    `fromStationId` INTEGER NOT NULL,
    `toStationId` INTEGER NOT NULL,
    `e_class_amount` INTEGER NOT NULL,
    `b_class_amount` INTEGER NOT NULL,
    `sleeper_class_amount` INTEGER NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Schedule` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `time` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Seat` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Seat_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SisterConcern` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `image` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CoreValue` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Offered` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NOT NULL,
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NOT NULL,
    `routeId` INTEGER NULL,
    `couponCode` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FAQ` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `question` TEXT NOT NULL,
    `answer` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserStatics` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pages` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` ENUM('Policy', 'Navigation') NOT NULL DEFAULT 'Policy',
    `title` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `content` TEXT NOT NULL,
    `seoTitle` VARCHAR(191) NULL,
    `seoDescription` VARCHAR(191) NULL,
    `status` ENUM('Draft', 'Trust', 'Published', 'Upcoming') NOT NULL DEFAULT 'Published',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BlogCategory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Blog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `author` VARCHAR(191) NOT NULL,
    `categoryId` INTEGER NOT NULL,
    `content` TEXT NOT NULL,
    `image` VARCHAR(191) NOT NULL,
    `seoTitle` VARCHAR(191) NULL,
    `seoDescription` VARCHAR(191) NULL,
    `status` ENUM('Draft', 'Trust', 'Published', 'Upcoming') NOT NULL DEFAULT 'Published',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Blog_title_key`(`title`),
    UNIQUE INDEX `Blog_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Trip` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `registrationNo` VARCHAR(191) NOT NULL,
    `coachConfigIdUpWay` INTEGER NOT NULL,
    `upDate` VARCHAR(191) NOT NULL,
    `downDate` VARCHAR(191) NULL,
    `coachConfigIdDownWay` INTEGER NULL,
    `totalIncome` INTEGER NOT NULL DEFAULT 0,
    `totalExpense` INTEGER NOT NULL DEFAULT 0,
    `cashOnHand` INTEGER NOT NULL DEFAULT 0,
    `gp` INTEGER NOT NULL DEFAULT 8000,
    `tripStatus` ENUM('Running', 'Close') NOT NULL DEFAULT 'Running',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CoachArrivedDepart` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `counterId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `coachConfigId` INTEGER NOT NULL,
    `isArrived` BOOLEAN NOT NULL DEFAULT true,
    `isDepart` BOOLEAN NOT NULL DEFAULT false,
    `arrivedDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `departDate` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CoachConfig` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `coachNo` VARCHAR(191) NOT NULL,
    `tripNo` INTEGER NULL,
    `registrationNo` VARCHAR(191) NULL,
    `supervisorId` INTEGER NULL,
    `supervisorStatus` ENUM('Pending', 'Success', 'Accepted', 'Failed', 'Cancelled', 'CancelRequest', 'Migrate') NOT NULL DEFAULT 'Pending',
    `driverId` INTEGER NULL,
    `driverStatus` ENUM('Pending', 'Success', 'Accepted', 'Failed', 'Cancelled', 'CancelRequest', 'Migrate') NOT NULL DEFAULT 'Pending',
    `helperId` INTEGER NULL,
    `helperStatus` ENUM('Pending', 'Success', 'Accepted', 'Failed', 'Cancelled', 'CancelRequest', 'Migrate') NOT NULL DEFAULT 'Pending',
    `discount` DOUBLE NOT NULL DEFAULT 0,
    `discountType` ENUM('Fixed', 'Percentage') NOT NULL DEFAULT 'Fixed',
    `seatAvailable` INTEGER NOT NULL DEFAULT 0,
    `tokenAvailable` INTEGER NOT NULL DEFAULT 0,
    `departureDate` VARCHAR(191) NOT NULL,
    `note` VARCHAR(191) NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CoachOpen` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `coachConfigId` INTEGER NOT NULL,
    `fromDate` DATETIME(3) NOT NULL,
    `toDate` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CoachClose` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `coachConfigId` INTEGER NOT NULL,
    `fromDate` DATETIME(3) NOT NULL,
    `toDate` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CoachConfigSeats` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `coachConfigId` INTEGER NOT NULL,
    `seat` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Fare` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `routeId` INTEGER NOT NULL,
    `type` VARCHAR(191) NOT NULL DEFAULT 'AC',
    `seatPlanId` INTEGER NOT NULL,
    `fromDate` DATETIME(3) NULL,
    `toDate` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SegmentFare` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fareId` INTEGER NOT NULL,
    `fromStationId` INTEGER NOT NULL,
    `toStationId` INTEGER NOT NULL,
    `amount` INTEGER NOT NULL,
    `e_class_amount` INTEGER NOT NULL DEFAULT 0,
    `b_class_amount` INTEGER NOT NULL DEFAULT 0,
    `sleeper_class_amount` INTEGER NOT NULL DEFAULT 0,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Customer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `password` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `fromStationId` INTEGER NULL,
    `destinationStationId` INTEGER NULL,
    `discountType` ENUM('Fixed', 'Percentage') NOT NULL DEFAULT 'Fixed',
    `discount` DOUBLE NOT NULL DEFAULT 0,
    `isPermanent` BOOLEAN NOT NULL DEFAULT false,
    `discountUse` INTEGER NOT NULL DEFAULT 0,
    `availableDiscount` INTEGER NOT NULL DEFAULT 0,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Customer_phone_key`(`phone`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Account` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bankName` VARCHAR(191) NOT NULL,
    `accountHolderName` VARCHAR(191) NOT NULL,
    `accountName` VARCHAR(191) NOT NULL,
    `accountNumber` VARCHAR(191) NOT NULL,
    `accountType` ENUM('MobileBanking', 'Bank', 'Cash') NOT NULL,
    `openingBalance` INTEGER NOT NULL,
    `currentBalance` DOUBLE NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BalanceTransfer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fromAccountId` INTEGER NOT NULL,
    `toAccountId` INTEGER NOT NULL,
    `amount` DOUBLE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Slider` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `image` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Category` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SubCategory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Vehicle` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `registrationNo` VARCHAR(191) NOT NULL,
    `manufacturerCompany` VARCHAR(191) NULL DEFAULT 'N/A',
    `model` VARCHAR(191) NULL DEFAULT 'N/A',
    `chasisNo` VARCHAR(191) NULL DEFAULT 'N/A',
    `engineNo` VARCHAR(191) NULL DEFAULT 'N/A',
    `countryOfOrigin` VARCHAR(191) NULL DEFAULT 'N/A',
    `lcCode` VARCHAR(191) NULL DEFAULT 'N/A',
    `deliveryToDipo` VARCHAR(191) NULL DEFAULT 'N/A',
    `deliveryDate` VARCHAR(191) NULL,
    `orderDate` VARCHAR(191) NULL,
    `coachType` VARCHAR(191) NULL,
    `seatPlan` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `registrationFile` VARCHAR(191) NOT NULL DEFAULT 'N/A',
    `registrationExpiryDate` VARCHAR(191) NOT NULL DEFAULT 'N/A',
    `fitnessExpiryDate` VARCHAR(191) NOT NULL DEFAULT 'N/A',
    `routePermitExpiryDate` VARCHAR(191) NOT NULL DEFAULT 'N/A',
    `taxTokenExpiryDate` VARCHAR(191) NOT NULL DEFAULT 'N/A',
    `fitnessCertificate` VARCHAR(191) NOT NULL DEFAULT 'N/A',
    `taxToken` VARCHAR(191) NOT NULL DEFAULT 'N/A',
    `routePermit` VARCHAR(191) NOT NULL DEFAULT 'N/A',
    `active` BOOLEAN NOT NULL DEFAULT true,
    `color` VARCHAR(191) NULL DEFAULT 'N/A',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Vehicle_registrationNo_key`(`registrationNo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ExpenseCategory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ExpenseSubCategory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `expenseCategoryId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Expense` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `coachConfigId` INTEGER NOT NULL,
    `supervisorId` INTEGER NOT NULL,
    `authorizeBy` INTEGER NULL,
    `fuelCompanyId` INTEGER NULL,
    `authorizeStatus` BOOLEAN NOT NULL DEFAULT false,
    `edit` BOOLEAN NOT NULL DEFAULT true,
    `expenseCategoryId` INTEGER NOT NULL,
    `routeDirection` ENUM('Up_Way', 'Down_Way') NOT NULL,
    `expenseType` ENUM('Fuel', 'Toll', 'Parking', 'Others') NOT NULL DEFAULT 'Others',
    `amount` INTEGER NOT NULL,
    `paidAmount` INTEGER NOT NULL DEFAULT 0,
    `dueAmount` INTEGER NOT NULL DEFAULT 0,
    `fuelWeight` INTEGER NOT NULL DEFAULT 0,
    `fuelPrice` INTEGER NOT NULL DEFAULT 0,
    `file` VARCHAR(191) NULL,
    `date` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DueTable` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `registrationNo` VARCHAR(191) NOT NULL,
    `fuelCompanyId` INTEGER NOT NULL,
    `due` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ExpenseCategoryAccounts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ExpenseSubCategoryAccounts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `expenseCategoryId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ExpenseAccounts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `note` VARCHAR(191) NULL,
    `expenseCategoryId` INTEGER NOT NULL,
    `expenseSubCategoryId` INTEGER NOT NULL,
    `totalAmount` INTEGER NOT NULL,
    `file` VARCHAR(191) NULL,
    `date` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SupervisorReportSubmit` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tripNo` INTEGER NULL,
    `supervisorId` INTEGER NOT NULL,
    `upWayCoachConfigId` INTEGER NOT NULL,
    `downWayCoachConfigId` INTEGER NOT NULL,
    `upWayDate` VARCHAR(191) NOT NULL,
    `downWayDate` VARCHAR(191) NOT NULL,
    `totalIncome` INTEGER NOT NULL DEFAULT 0,
    `totalExpense` INTEGER NOT NULL DEFAULT 0,
    `bannerCost` INTEGER NOT NULL DEFAULT 8000,
    `cashOnHand` INTEGER NOT NULL,
    `authorize` INTEGER NULL,
    `authorizeStatus` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CounterReportSubmit` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tripNo` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `coachConfigId` INTEGER NOT NULL,
    `date` VARCHAR(191) NOT NULL,
    `counterId` INTEGER NOT NULL,
    `totalPassenger` INTEGER NOT NULL,
    `amount` INTEGER NOT NULL,
    `authorize` INTEGER NULL,
    `authorizeStatus` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PaymentAccounts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NULL,
    `accountId` INTEGER NOT NULL,
    `paymentAmount` DOUBLE NOT NULL,
    `paymentType` ENUM('Expense', 'Fuel', 'Supervisor', 'Counter') NOT NULL DEFAULT 'Expense',
    `paymentInOut` ENUM('IN', 'OUT') NOT NULL DEFAULT 'OUT',
    `expenseAccountId` INTEGER NULL,
    `note` VARCHAR(191) NOT NULL DEFAULT 'N/A',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Collection` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `coachConfigId` INTEGER NOT NULL,
    `counterId` INTEGER NULL,
    `authorizeBy` INTEGER NULL,
    `authorizeStatus` BOOLEAN NOT NULL DEFAULT false,
    `edit` BOOLEAN NOT NULL DEFAULT true,
    `supervisorId` INTEGER NOT NULL,
    `collectionType` ENUM('CounterCollection', 'OpeningBalance', 'OthersIncome') NOT NULL DEFAULT 'CounterCollection',
    `routeDirection` ENUM('Up_Way', 'Down_Way') NOT NULL,
    `noOfPassenger` INTEGER NOT NULL DEFAULT 0,
    `token` INTEGER NOT NULL DEFAULT 0,
    `amount` INTEGER NOT NULL,
    `date` VARCHAR(191) NOT NULL,
    `close` BOOLEAN NOT NULL DEFAULT false,
    `file` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FuelPayment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `paymentType` ENUM('FirstPayment', 'DuePayment') NOT NULL DEFAULT 'FirstPayment',
    `expenseId` INTEGER NULL,
    `coachConfigId` INTEGER NULL,
    `registrationNo` VARCHAR(191) NOT NULL,
    `userId` INTEGER NOT NULL,
    `fuelCompanyId` INTEGER NOT NULL,
    `date` VARCHAR(191) NOT NULL,
    `amount` INTEGER NOT NULL DEFAULT 0,
    `paidAmount` INTEGER NOT NULL,
    `currentDueAmount` INTEGER NOT NULL,
    `fuelWeight` INTEGER NOT NULL DEFAULT 0,
    `fuelPrice` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FuelCompany` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `website` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RegistrationDiscount` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `discountType` ENUM('Fixed', 'Percentage') NOT NULL DEFAULT 'Fixed',
    `discount` DOUBLE NOT NULL,
    `isPermanent` BOOLEAN NOT NULL,
    `usedLimit` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Order` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ticketNo` VARCHAR(191) NOT NULL,
    `returnOrderId` INTEGER NULL,
    `counterId` INTEGER NULL,
    `coachConfigId` INTEGER NOT NULL,
    `userId` INTEGER NULL,
    `orderType` ENUM('One_Trip', 'Round_Trip') NOT NULL DEFAULT 'One_Trip',
    `customerName` VARCHAR(191) NOT NULL DEFAULT 'N/A',
    `phone` VARCHAR(191) NOT NULL DEFAULT 'N/A',
    `email` VARCHAR(191) NULL,
    `address` VARCHAR(191) NOT NULL DEFAULT 'N/A',
    `age` VARCHAR(191) NULL,
    `gender` ENUM('Male', 'Female') NULL DEFAULT 'Male',
    `status` ENUM('Pending', 'Success', 'Accepted', 'Failed', 'Cancelled', 'CancelRequest', 'Migrate') NOT NULL DEFAULT 'Pending',
    `cancelBy` INTEGER NULL,
    `cancelNote` VARCHAR(191) NULL,
    `refundPercentage` INTEGER NULL,
    `refundType` VARCHAR(191) NULL,
    `cancelRequest` BOOLEAN NOT NULL DEFAULT false,
    `nid` VARCHAR(191) NOT NULL DEFAULT 'N/A',
    `nationality` VARCHAR(191) NOT NULL DEFAULT 'Bangladesh',
    `paymentMethod` VARCHAR(191) NOT NULL DEFAULT 'N/A',
    `paymentType` ENUM('FULL', 'PARTIAL') NOT NULL DEFAULT 'FULL',
    `boardingPoint` VARCHAR(191) NOT NULL DEFAULT 'N/A',
    `droppingPoint` VARCHAR(191) NOT NULL DEFAULT 'N/A',
    `returnBoardingPoint` VARCHAR(191) NOT NULL DEFAULT 'N/A',
    `returnDroppingPoint` VARCHAR(191) NOT NULL DEFAULT 'N/A',
    `noOfSeat` INTEGER NOT NULL DEFAULT 1,
    `amount` INTEGER NOT NULL,
    `paymentAmount` INTEGER NOT NULL DEFAULT 0,
    `dueAmount` INTEGER NOT NULL DEFAULT 0,
    `payment` BOOLEAN NOT NULL DEFAULT false,
    `partial` BOOLEAN NOT NULL DEFAULT false,
    `partialPaymentAmount` INTEGER NOT NULL DEFAULT 0,
    `smsSend` BOOLEAN NOT NULL DEFAULT false,
    `online` BOOLEAN NOT NULL DEFAULT true,
    `date` VARCHAR(191) NOT NULL,
    `returnDate` VARCHAR(191) NULL,
    `goods` INTEGER NOT NULL DEFAULT 0,
    `grossPay` INTEGER NOT NULL DEFAULT 0,
    `goodsDiscount` INTEGER NOT NULL DEFAULT 0,
    `netPay` INTEGER NOT NULL DEFAULT 0,
    `bookingType` ENUM('SeatIssue', 'SeatBooking') NOT NULL DEFAULT 'SeatIssue',
    `expiryBookingDate` VARCHAR(191) NULL,
    `expiryBookingTime` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Order_ticketNo_key`(`ticketNo`),
    UNIQUE INDEX `Order_returnOrderId_key`(`returnOrderId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GoodsOparation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ticketNumber` VARCHAR(191) NOT NULL,
    `goods` INTEGER NOT NULL DEFAULT 0,
    `grossPay` INTEGER NOT NULL DEFAULT 0,
    `goodsDiscount` INTEGER NOT NULL DEFAULT 0,
    `netPay` INTEGER NOT NULL DEFAULT 0,
    `previeousPay` INTEGER NOT NULL DEFAULT 0,
    `totalPay` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `orderSeat` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `orderId` INTEGER NOT NULL,
    `migrateSeatId` INTEGER NULL,
    `coachConfigId` INTEGER NOT NULL,
    `class` ENUM('B_Class', 'E_Class', 'S_Class', 'Sleeper') NOT NULL DEFAULT 'Sleeper',
    `segmentId` INTEGER NOT NULL,
    `isSeatShare` BOOLEAN NOT NULL DEFAULT false,
    `fromStationId` INTEGER NOT NULL,
    `destinationStationId` INTEGER NOT NULL,
    `status` ENUM('Pending', 'Success', 'Accepted', 'Failed', 'Cancelled', 'CancelRequest', 'Migrate') NOT NULL DEFAULT 'Pending',
    `fare` INTEGER NOT NULL DEFAULT 0,
    `discount` INTEGER NOT NULL DEFAULT 0,
    `online` BOOLEAN NOT NULL DEFAULT true,
    `cancelBy` INTEGER NULL,
    `paymentMethod` VARCHAR(191) NOT NULL DEFAULT 'N/A',
    `date` VARCHAR(191) NOT NULL,
    `seat` VARCHAR(191) NOT NULL,
    `unitPrice` INTEGER NOT NULL DEFAULT 0,
    `cancelNote` VARCHAR(191) NULL,
    `refundAmount` INTEGER NOT NULL DEFAULT 0,
    `refundType` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `cancelDate` DATETIME(3) NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `orderSeat_migrateSeatId_key`(`migrateSeatId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BookingSeat` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `counterId` INTEGER NOT NULL,
    `coachConfigId` INTEGER NOT NULL,
    `seat` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CounterBookedSeat` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `counterId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `coachConfigId` INTEGER NOT NULL,
    `segmentId` INTEGER NOT NULL,
    `isSeatShare` BOOLEAN NOT NULL DEFAULT false,
    `fromStationId` INTEGER NOT NULL,
    `destinationStationId` INTEGER NOT NULL,
    `date` VARCHAR(191) NOT NULL,
    `seat` VARCHAR(191) NOT NULL,
    `customerName` VARCHAR(191) NOT NULL DEFAULT 'N/A',
    `phone` VARCHAR(191) NOT NULL DEFAULT 'N/A',
    `email` VARCHAR(191) NULL,
    `address` VARCHAR(191) NOT NULL DEFAULT 'N/A',
    `age` VARCHAR(191) NULL,
    `gender` ENUM('Male', 'Female') NULL DEFAULT 'Male',
    `nid` VARCHAR(191) NOT NULL DEFAULT 'N/A',
    `nationality` VARCHAR(191) NOT NULL DEFAULT 'Bangladesh',
    `paymentMethod` VARCHAR(191) NOT NULL DEFAULT 'N/A',
    `paymentType` ENUM('FULL', 'PARTIAL') NOT NULL DEFAULT 'FULL',
    `boardingPoint` VARCHAR(191) NOT NULL DEFAULT 'N/A',
    `droppingPoint` VARCHAR(191) NOT NULL DEFAULT 'N/A',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CancelOrderSeat` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `orderId` INTEGER NOT NULL,
    `coachConfigId` INTEGER NOT NULL,
    `status` ENUM('Pending', 'Success', 'Accepted', 'Failed', 'Cancelled', 'CancelRequest', 'Migrate') NOT NULL DEFAULT 'Success',
    `online` BOOLEAN NOT NULL DEFAULT true,
    `schedule` VARCHAR(191) NOT NULL,
    `date` VARCHAR(191) NOT NULL,
    `seat` VARCHAR(191) NOT NULL,
    `unitPrice` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Discount` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `discountType` ENUM('Fixed', 'Percentage') NOT NULL DEFAULT 'Fixed',
    `discount` INTEGER NOT NULL,
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Payment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `orderId` INTEGER NOT NULL,
    `returnOrderId` INTEGER NULL,
    `userPhone` VARCHAR(191) NOT NULL,
    `userEmail` VARCHAR(191) NOT NULL DEFAULT 'N/A',
    `transId` VARCHAR(191) NOT NULL,
    `valId` VARCHAR(191) NOT NULL DEFAULT 'N/A',
    `cardType` VARCHAR(191) NOT NULL DEFAULT 'N/A',
    `cardIssuer` VARCHAR(191) NOT NULL DEFAULT 'N/A',
    `bankTransId` VARCHAR(191) NOT NULL DEFAULT 'N/A',
    `card_brand` VARCHAR(191) NOT NULL DEFAULT 'N/A',
    `sessionKey` VARCHAR(191) NOT NULL,
    `amount` INTEGER NOT NULL,
    `status` ENUM('Pending', 'Success', 'Accepted', 'Failed', 'Cancelled', 'CancelRequest', 'Migrate') NOT NULL DEFAULT 'Pending',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Payment_transId_key`(`transId`),
    UNIQUE INDEX `Payment_sessionKey_key`(`sessionKey`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InternalPayment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `accountId` INTEGER NOT NULL,
    `paymentAmount` DOUBLE NOT NULL,
    `person` ENUM('Investor') NOT NULL DEFAULT 'Investor',
    `investorId` INTEGER NULL,
    `type` ENUM('Credit', 'Debit') NOT NULL,
    `subject` ENUM('Invest', 'InvestOut', 'Payment', 'Expense') NOT NULL,
    `investingId` INTEGER NULL,
    `expenseId` INTEGER NULL,
    `note` VARCHAR(191) NOT NULL DEFAULT 'N/A',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RefundPayment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `paymentId` INTEGER NOT NULL,
    `refundRefId` VARCHAR(191) NOT NULL,
    `refundAmount` INTEGER NOT NULL,
    `refundRemarks` VARCHAR(191) NOT NULL,
    `refundStatus` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Investor` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `city` VARCHAR(191) NULL,
    `postalCode` VARCHAR(191) NULL,
    `country` VARCHAR(191) NOT NULL DEFAULT 'Bangladesh',
    `dueAmount` INTEGER NOT NULL DEFAULT 0,
    `advanceAmount` INTEGER NOT NULL DEFAULT 0,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Investor_phone_key`(`phone`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Investing` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `investorId` INTEGER NOT NULL,
    `interest` INTEGER NOT NULL DEFAULT 0,
    `note` VARCHAR(191) NULL,
    `investingBalances` INTEGER NOT NULL,
    `investingType` ENUM('Investing', 'BankLoan', 'KarzeHasana') NOT NULL,
    `type` ENUM('In', 'Out') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CMS` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `companyName` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `companyNameBangla` VARCHAR(191) NULL,
    `companyLogo` VARCHAR(191) NULL,
    `loginPageImage` VARCHAR(191) NULL,
    `companyLogoBangla` VARCHAR(191) NULL,
    `footerLogo` VARCHAR(191) NULL,
    `footerLogoBangla` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `addressBangla` VARCHAR(191) NULL,
    `city` VARCHAR(191) NULL,
    `cityBangla` VARCHAR(191) NULL,
    `postalCode` VARCHAR(191) NULL,
    `supportNumber1` VARCHAR(191) NULL,
    `supportNumber2` VARCHAR(191) NULL,
    `contactUsImage` VARCHAR(191) NULL,
    `locationImage` VARCHAR(191) NULL,
    `faqImage` VARCHAR(191) NULL,
    `policyImage` VARCHAR(191) NULL,
    `googleMap` TEXT NULL,
    `aboutUsContent` TEXT NULL,
    `homePageDescription` TEXT NULL,
    `homePageDescriptionBangla` TEXT NULL,
    `offeredImageOne` VARCHAR(191) NULL,
    `offeredImageTwo` VARCHAR(191) NULL,
    `offeredImageThree` VARCHAR(191) NULL,
    `findTicketBanner` VARCHAR(191) NULL,
    `facebook` VARCHAR(191) NULL,
    `instagram` VARCHAR(191) NULL,
    `twitter` VARCHAR(191) NULL,
    `linkedin` VARCHAR(191) NULL,
    `blogImage` VARCHAR(191) NULL,
    `youtube` VARCHAR(191) NULL,
    `qrImage` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PermissionType` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Permission` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `permissionTypeId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RolePermission` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `role` ENUM('ADMIN', 'DEVELOPER', 'SUPERVISOR') NOT NULL,
    `permissionId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserPermission` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `permissionId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Reserve` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `registrationNo` VARCHAR(191) NULL,
    `fromDate` DATETIME(3) NOT NULL,
    `fromDateTime` VARCHAR(191) NULL,
    `toDate` DATETIME(3) NOT NULL,
    `toDateTime` VARCHAR(191) NULL,
    `fromStationId` INTEGER NOT NULL,
    `destinationStationId` INTEGER NOT NULL,
    `routeId` INTEGER NULL,
    `noOfSeat` INTEGER NOT NULL,
    `coachClass` ENUM('B_Class', 'E_Class', 'S_Class', 'Sleeper') NOT NULL,
    `from` VARCHAR(191) NULL,
    `to` VARCHAR(191) NULL,
    `passengerName` VARCHAR(191) NOT NULL,
    `contactNo` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `amount` INTEGER NULL DEFAULT 0,
    `paidAmount` INTEGER NULL DEFAULT 0,
    `dueAmount` INTEGER NULL DEFAULT 0,
    `remarks` VARCHAR(191) NULL,
    `isConfirm` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Review` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `customerId` INTEGER NOT NULL,
    `orderId` INTEGER NOT NULL,
    `rating` INTEGER NOT NULL,
    `comment` VARCHAR(191) NOT NULL,
    `status` ENUM('Pending', 'Approved', 'Rejected') NOT NULL DEFAULT 'Pending',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Review_orderId_key`(`orderId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_counterId_fkey` FOREIGN KEY (`counterId`) REFERENCES `Counter`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FundPrepaid` ADD CONSTRAINT `FundPrepaid_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CoachAssignToCounterMaster` ADD CONSTRAINT `CoachAssignToCounterMaster_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CoachAssignToCounterMaster` ADD CONSTRAINT `CoachAssignToCounterMaster_counterId_fkey` FOREIGN KEY (`counterId`) REFERENCES `Counter`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BookingRoutePermission` ADD CONSTRAINT `BookingRoutePermission_coachAssignId_fkey` FOREIGN KEY (`coachAssignId`) REFERENCES `CoachAssignToCounterMaster`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BookingRoutePermission` ADD CONSTRAINT `BookingRoutePermission_routeId_fkey` FOREIGN KEY (`routeId`) REFERENCES `Route`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SellingRoutePermission` ADD CONSTRAINT `SellingRoutePermission_coachAssignId_fkey` FOREIGN KEY (`coachAssignId`) REFERENCES `CoachAssignToCounterMaster`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SellingRoutePermission` ADD CONSTRAINT `SellingRoutePermission_routeId_fkey` FOREIGN KEY (`routeId`) REFERENCES `Route`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PermissionUser` ADD CONSTRAINT `PermissionUser_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Coach` ADD CONSTRAINT `Coach_routeId_fkey` FOREIGN KEY (`routeId`) REFERENCES `Route`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Coach` ADD CONSTRAINT `Coach_seatPlanId_fkey` FOREIGN KEY (`seatPlanId`) REFERENCES `SeatPlan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Coach` ADD CONSTRAINT `Coach_fromCounterId_fkey` FOREIGN KEY (`fromCounterId`) REFERENCES `Counter`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Coach` ADD CONSTRAINT `Coach_destinationCounterId_fkey` FOREIGN KEY (`destinationCounterId`) REFERENCES `Counter`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CoachViaRoute` ADD CONSTRAINT `CoachViaRoute_coachId_fkey` FOREIGN KEY (`coachId`) REFERENCES `Coach`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CoachViaRoute` ADD CONSTRAINT `CoachViaRoute_counterId_fkey` FOREIGN KEY (`counterId`) REFERENCES `Counter`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Counter` ADD CONSTRAINT `Counter_stationId_fkey` FOREIGN KEY (`stationId`) REFERENCES `Station`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Route` ADD CONSTRAINT `Route_from_fkey` FOREIGN KEY (`from`) REFERENCES `Station`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Route` ADD CONSTRAINT `Route_to_fkey` FOREIGN KEY (`to`) REFERENCES `Station`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `viaRoute` ADD CONSTRAINT `viaRoute_stationId_fkey` FOREIGN KEY (`stationId`) REFERENCES `Station`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `viaRoute` ADD CONSTRAINT `viaRoute_routeId_fkey` FOREIGN KEY (`routeId`) REFERENCES `Route`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Segment` ADD CONSTRAINT `Segment_routeId_fkey` FOREIGN KEY (`routeId`) REFERENCES `Route`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Segment` ADD CONSTRAINT `Segment_fromStationId_fkey` FOREIGN KEY (`fromStationId`) REFERENCES `Station`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Segment` ADD CONSTRAINT `Segment_toStationId_fkey` FOREIGN KEY (`toStationId`) REFERENCES `Station`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Offered` ADD CONSTRAINT `Offered_routeId_fkey` FOREIGN KEY (`routeId`) REFERENCES `Route`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Trip` ADD CONSTRAINT `Trip_coachConfigIdUpWay_fkey` FOREIGN KEY (`coachConfigIdUpWay`) REFERENCES `CoachConfig`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CoachArrivedDepart` ADD CONSTRAINT `CoachArrivedDepart_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CoachArrivedDepart` ADD CONSTRAINT `CoachArrivedDepart_counterId_fkey` FOREIGN KEY (`counterId`) REFERENCES `Counter`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CoachArrivedDepart` ADD CONSTRAINT `CoachArrivedDepart_coachConfigId_fkey` FOREIGN KEY (`coachConfigId`) REFERENCES `CoachConfig`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CoachConfig` ADD CONSTRAINT `CoachConfig_supervisorId_fkey` FOREIGN KEY (`supervisorId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CoachConfig` ADD CONSTRAINT `CoachConfig_coachNo_fkey` FOREIGN KEY (`coachNo`) REFERENCES `Coach`(`coachNo`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CoachConfig` ADD CONSTRAINT `CoachConfig_registrationNo_fkey` FOREIGN KEY (`registrationNo`) REFERENCES `Vehicle`(`registrationNo`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CoachConfig` ADD CONSTRAINT `CoachConfig_driverId_fkey` FOREIGN KEY (`driverId`) REFERENCES `Driver`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CoachConfig` ADD CONSTRAINT `CoachConfig_helperId_fkey` FOREIGN KEY (`helperId`) REFERENCES `Helper`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CoachOpen` ADD CONSTRAINT `CoachOpen_coachConfigId_fkey` FOREIGN KEY (`coachConfigId`) REFERENCES `CoachConfig`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CoachClose` ADD CONSTRAINT `CoachClose_coachConfigId_fkey` FOREIGN KEY (`coachConfigId`) REFERENCES `CoachConfig`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Fare` ADD CONSTRAINT `Fare_routeId_fkey` FOREIGN KEY (`routeId`) REFERENCES `Route`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Fare` ADD CONSTRAINT `Fare_seatPlanId_fkey` FOREIGN KEY (`seatPlanId`) REFERENCES `SeatPlan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SegmentFare` ADD CONSTRAINT `SegmentFare_fromStationId_fkey` FOREIGN KEY (`fromStationId`) REFERENCES `Station`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SegmentFare` ADD CONSTRAINT `SegmentFare_toStationId_fkey` FOREIGN KEY (`toStationId`) REFERENCES `Station`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SegmentFare` ADD CONSTRAINT `SegmentFare_fareId_fkey` FOREIGN KEY (`fareId`) REFERENCES `Fare`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BalanceTransfer` ADD CONSTRAINT `BalanceTransfer_fromAccountId_fkey` FOREIGN KEY (`fromAccountId`) REFERENCES `Account`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BalanceTransfer` ADD CONSTRAINT `BalanceTransfer_toAccountId_fkey` FOREIGN KEY (`toAccountId`) REFERENCES `Account`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ExpenseSubCategory` ADD CONSTRAINT `ExpenseSubCategory_expenseCategoryId_fkey` FOREIGN KEY (`expenseCategoryId`) REFERENCES `ExpenseCategory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Expense` ADD CONSTRAINT `Expense_fuelCompanyId_fkey` FOREIGN KEY (`fuelCompanyId`) REFERENCES `FuelCompany`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Expense` ADD CONSTRAINT `Expense_coachConfigId_fkey` FOREIGN KEY (`coachConfigId`) REFERENCES `CoachConfig`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Expense` ADD CONSTRAINT `Expense_supervisorId_fkey` FOREIGN KEY (`supervisorId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Expense` ADD CONSTRAINT `Expense_authorizeBy_fkey` FOREIGN KEY (`authorizeBy`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Expense` ADD CONSTRAINT `Expense_expenseCategoryId_fkey` FOREIGN KEY (`expenseCategoryId`) REFERENCES `ExpenseCategory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DueTable` ADD CONSTRAINT `DueTable_fuelCompanyId_fkey` FOREIGN KEY (`fuelCompanyId`) REFERENCES `FuelCompany`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DueTable` ADD CONSTRAINT `DueTable_registrationNo_fkey` FOREIGN KEY (`registrationNo`) REFERENCES `Vehicle`(`registrationNo`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ExpenseSubCategoryAccounts` ADD CONSTRAINT `ExpenseSubCategoryAccounts_expenseCategoryId_fkey` FOREIGN KEY (`expenseCategoryId`) REFERENCES `ExpenseCategoryAccounts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ExpenseAccounts` ADD CONSTRAINT `ExpenseAccounts_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ExpenseAccounts` ADD CONSTRAINT `ExpenseAccounts_expenseCategoryId_fkey` FOREIGN KEY (`expenseCategoryId`) REFERENCES `ExpenseCategoryAccounts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ExpenseAccounts` ADD CONSTRAINT `ExpenseAccounts_expenseSubCategoryId_fkey` FOREIGN KEY (`expenseSubCategoryId`) REFERENCES `ExpenseSubCategoryAccounts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SupervisorReportSubmit` ADD CONSTRAINT `SupervisorReportSubmit_supervisorId_fkey` FOREIGN KEY (`supervisorId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SupervisorReportSubmit` ADD CONSTRAINT `SupervisorReportSubmit_authorize_fkey` FOREIGN KEY (`authorize`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SupervisorReportSubmit` ADD CONSTRAINT `SupervisorReportSubmit_upWayCoachConfigId_fkey` FOREIGN KEY (`upWayCoachConfigId`) REFERENCES `CoachConfig`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SupervisorReportSubmit` ADD CONSTRAINT `SupervisorReportSubmit_downWayCoachConfigId_fkey` FOREIGN KEY (`downWayCoachConfigId`) REFERENCES `CoachConfig`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CounterReportSubmit` ADD CONSTRAINT `CounterReportSubmit_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CounterReportSubmit` ADD CONSTRAINT `CounterReportSubmit_authorize_fkey` FOREIGN KEY (`authorize`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CounterReportSubmit` ADD CONSTRAINT `CounterReportSubmit_coachConfigId_fkey` FOREIGN KEY (`coachConfigId`) REFERENCES `CoachConfig`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PaymentAccounts` ADD CONSTRAINT `PaymentAccounts_accountId_fkey` FOREIGN KEY (`accountId`) REFERENCES `Account`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PaymentAccounts` ADD CONSTRAINT `PaymentAccounts_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PaymentAccounts` ADD CONSTRAINT `PaymentAccounts_expenseAccountId_fkey` FOREIGN KEY (`expenseAccountId`) REFERENCES `ExpenseAccounts`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Collection` ADD CONSTRAINT `Collection_coachConfigId_fkey` FOREIGN KEY (`coachConfigId`) REFERENCES `CoachConfig`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Collection` ADD CONSTRAINT `Collection_counterId_fkey` FOREIGN KEY (`counterId`) REFERENCES `Counter`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Collection` ADD CONSTRAINT `Collection_supervisorId_fkey` FOREIGN KEY (`supervisorId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Collection` ADD CONSTRAINT `Collection_authorizeBy_fkey` FOREIGN KEY (`authorizeBy`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FuelPayment` ADD CONSTRAINT `FuelPayment_expenseId_fkey` FOREIGN KEY (`expenseId`) REFERENCES `Expense`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FuelPayment` ADD CONSTRAINT `FuelPayment_coachConfigId_fkey` FOREIGN KEY (`coachConfigId`) REFERENCES `CoachConfig`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FuelPayment` ADD CONSTRAINT `FuelPayment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FuelPayment` ADD CONSTRAINT `FuelPayment_fuelCompanyId_fkey` FOREIGN KEY (`fuelCompanyId`) REFERENCES `FuelCompany`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FuelPayment` ADD CONSTRAINT `FuelPayment_registrationNo_fkey` FOREIGN KEY (`registrationNo`) REFERENCES `Vehicle`(`registrationNo`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_cancelBy_fkey` FOREIGN KEY (`cancelBy`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_counterId_fkey` FOREIGN KEY (`counterId`) REFERENCES `Counter`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_coachConfigId_fkey` FOREIGN KEY (`coachConfigId`) REFERENCES `CoachConfig`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_returnOrderId_fkey` FOREIGN KEY (`returnOrderId`) REFERENCES `Order`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orderSeat` ADD CONSTRAINT `orderSeat_fromStationId_fkey` FOREIGN KEY (`fromStationId`) REFERENCES `Station`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orderSeat` ADD CONSTRAINT `orderSeat_destinationStationId_fkey` FOREIGN KEY (`destinationStationId`) REFERENCES `Station`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orderSeat` ADD CONSTRAINT `orderSeat_coachConfigId_fkey` FOREIGN KEY (`coachConfigId`) REFERENCES `CoachConfig`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orderSeat` ADD CONSTRAINT `orderSeat_segmentId_fkey` FOREIGN KEY (`segmentId`) REFERENCES `SegmentFare`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orderSeat` ADD CONSTRAINT `orderSeat_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orderSeat` ADD CONSTRAINT `orderSeat_cancelBy_fkey` FOREIGN KEY (`cancelBy`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orderSeat` ADD CONSTRAINT `orderSeat_migrateSeatId_fkey` FOREIGN KEY (`migrateSeatId`) REFERENCES `orderSeat`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BookingSeat` ADD CONSTRAINT `BookingSeat_coachConfigId_fkey` FOREIGN KEY (`coachConfigId`) REFERENCES `CoachConfig`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BookingSeat` ADD CONSTRAINT `BookingSeat_counterId_fkey` FOREIGN KEY (`counterId`) REFERENCES `Counter`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CounterBookedSeat` ADD CONSTRAINT `CounterBookedSeat_coachConfigId_fkey` FOREIGN KEY (`coachConfigId`) REFERENCES `CoachConfig`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CounterBookedSeat` ADD CONSTRAINT `CounterBookedSeat_counterId_fkey` FOREIGN KEY (`counterId`) REFERENCES `Counter`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CounterBookedSeat` ADD CONSTRAINT `CounterBookedSeat_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CounterBookedSeat` ADD CONSTRAINT `CounterBookedSeat_segmentId_fkey` FOREIGN KEY (`segmentId`) REFERENCES `SegmentFare`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CancelOrderSeat` ADD CONSTRAINT `CancelOrderSeat_coachConfigId_fkey` FOREIGN KEY (`coachConfigId`) REFERENCES `CoachConfig`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CancelOrderSeat` ADD CONSTRAINT `CancelOrderSeat_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InternalPayment` ADD CONSTRAINT `InternalPayment_accountId_fkey` FOREIGN KEY (`accountId`) REFERENCES `Account`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InternalPayment` ADD CONSTRAINT `InternalPayment_expenseId_fkey` FOREIGN KEY (`expenseId`) REFERENCES `Expense`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InternalPayment` ADD CONSTRAINT `InternalPayment_investorId_fkey` FOREIGN KEY (`investorId`) REFERENCES `Investor`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InternalPayment` ADD CONSTRAINT `InternalPayment_investingId_fkey` FOREIGN KEY (`investingId`) REFERENCES `Investing`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RefundPayment` ADD CONSTRAINT `RefundPayment_paymentId_fkey` FOREIGN KEY (`paymentId`) REFERENCES `Payment`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Investing` ADD CONSTRAINT `Investing_investorId_fkey` FOREIGN KEY (`investorId`) REFERENCES `Investor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Permission` ADD CONSTRAINT `Permission_permissionTypeId_fkey` FOREIGN KEY (`permissionTypeId`) REFERENCES `PermissionType`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RolePermission` ADD CONSTRAINT `RolePermission_permissionId_fkey` FOREIGN KEY (`permissionId`) REFERENCES `Permission`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserPermission` ADD CONSTRAINT `UserPermission_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserPermission` ADD CONSTRAINT `UserPermission_permissionId_fkey` FOREIGN KEY (`permissionId`) REFERENCES `Permission`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reserve` ADD CONSTRAINT `Reserve_routeId_fkey` FOREIGN KEY (`routeId`) REFERENCES `Route`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Review` ADD CONSTRAINT `Review_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Review` ADD CONSTRAINT `Review_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
