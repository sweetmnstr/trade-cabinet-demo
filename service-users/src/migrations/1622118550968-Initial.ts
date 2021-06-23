import {MigrationInterface, QueryRunner} from "typeorm";

export class Initial1622118550968 implements MigrationInterface {
    name = 'Initial1622118550968'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `accountTypes` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(50) NOT NULL, UNIQUE INDEX `IDX_c67fe307651535669ac5d5a678` (`name`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `leads` (`id` int NOT NULL AUTO_INCREMENT, `sourceId` int NOT NULL, `externalId` int NULL, UNIQUE INDEX `REL_c128c8da4010cd2cd0b4ae1c56` (`externalId`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `transactionBitcoins` (`id` int NOT NULL AUTO_INCREMENT, `state` enum ('Init', 'AwaitConfirm', 'Completed') NOT NULL, `amount` int NOT NULL, `receivingAddress` varchar(255) NOT NULL, `blockchainTransactionId` varchar(255) NOT NULL, `numConfirmations` int NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `transactionCards` (`id` int NOT NULL AUTO_INCREMENT, `state` enum ('Init', 'AwaitCredentials', 'AwaitClear', 'AwaitAuth', 'AwaitConfirm', 'Completed') NOT NULL, `amount` float NOT NULL, `cardNumber` varchar(255) NOT NULL, `expirationDate` varchar(255) NOT NULL, `cvv` varchar(255) NOT NULL, `cardHolder` varchar(50) NOT NULL, `authCode` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `clientTransactions` (`id` int NOT NULL AUTO_INCREMENT, `type` enum ('Card', 'Bitcoin') NOT NULL, `status` enum ('Pending', 'Success', 'Fail') NULL, `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, `externalId` int NULL, `transactionBitcoinId` int NULL, `transactionCardId` int NULL, UNIQUE INDEX `REL_f079f8c5ae4cb0529750150529` (`externalId`), UNIQUE INDEX `REL_d18708031216bc67db82b47a0f` (`transactionBitcoinId`), UNIQUE INDEX `REL_e39c04f3c54d14c4e13ced8124` (`transactionCardId`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `partners` (`id` int NOT NULL AUTO_INCREMENT, `firstName` varchar(50) NOT NULL, `lastName` varchar(50) NOT NULL, `email` varchar(50) NOT NULL, `username` varchar(50) NOT NULL, `phone` varchar(50) NOT NULL, `languageCode` varchar(2) NOT NULL, `isTest` tinyint NOT NULL, `hasDeposited` tinyint NOT NULL, `balanceUsd` int NOT NULL, `isVerified` tinyint NOT NULL, `isSuspended` tinyint NOT NULL, `statusName` varchar(255) NOT NULL, `statusGroupName` varchar(255) NOT NULL, `agentId` int NOT NULL, `agentName` varchar(50) NOT NULL, `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, UNIQUE INDEX `IDX_6b39bc13ab676e74eada2e744d` (`email`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `bitcoinWallets` (`id` int NOT NULL AUTO_INCREMENT, `address` varchar(255) NOT NULL, `publicKey` varchar(255) NOT NULL, `privateKey` varchar(255) NOT NULL, `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, `externalId` int NULL, UNIQUE INDEX `REL_e0a68881fecf384f328da966e4` (`externalId`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `clientAccounts` (`id` int NOT NULL AUTO_INCREMENT, `accountNumber` int NOT NULL, `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, `externalId` int NULL, UNIQUE INDEX `REL_d6fcf3ad6446497943b6bd68eb` (`externalId`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `languages` (`id` int NOT NULL AUTO_INCREMENT, `code` varchar(2) NOT NULL, UNIQUE INDEX `IDX_7397752718d1c9eb873722ec9b` (`code`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `paymentTypes` (`id` int NOT NULL AUTO_INCREMENT, `type` enum ('Card', 'Bitcoin') NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `users` (`id` int NOT NULL AUTO_INCREMENT, `email` varchar(50) NOT NULL, `hash` varchar(56) NOT NULL, `salt` varchar(50) NOT NULL, `firstName` varchar(50) NOT NULL, `lastName` varchar(50) NOT NULL, `phone` varchar(50) NOT NULL, `balance` decimal(8,2) NOT NULL DEFAULT '0.00', `userType` enum ('user', 'banned', 'admin') NOT NULL, `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, `accountTypeId` int NULL, UNIQUE INDEX `IDX_97672ac88f789774dd47f7c8be` (`email`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `sessions` (`id` int NOT NULL AUTO_INCREMENT, `refreshToken` varchar(36) NOT NULL, `expiredAt` timestamp NOT NULL, `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, `userId` int NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `leads` ADD CONSTRAINT `FK_c128c8da4010cd2cd0b4ae1c56f` FOREIGN KEY (`externalId`) REFERENCES `partners`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `clientTransactions` ADD CONSTRAINT `FK_f079f8c5ae4cb05297501505292` FOREIGN KEY (`externalId`) REFERENCES `partners`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `clientTransactions` ADD CONSTRAINT `FK_d18708031216bc67db82b47a0f2` FOREIGN KEY (`transactionBitcoinId`) REFERENCES `transactionBitcoins`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `clientTransactions` ADD CONSTRAINT `FK_e39c04f3c54d14c4e13ced81244` FOREIGN KEY (`transactionCardId`) REFERENCES `transactionCards`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `bitcoinWallets` ADD CONSTRAINT `FK_e0a68881fecf384f328da966e48` FOREIGN KEY (`externalId`) REFERENCES `partners`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `clientAccounts` ADD CONSTRAINT `FK_d6fcf3ad6446497943b6bd68eb5` FOREIGN KEY (`externalId`) REFERENCES `partners`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `users` ADD CONSTRAINT `FK_5e1a29e5ed3f2c167f87f2993ac` FOREIGN KEY (`accountTypeId`) REFERENCES `accountTypes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE");
        await queryRunner.query("ALTER TABLE `sessions` ADD CONSTRAINT `FK_57de40bc620f456c7311aa3a1e6` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `sessions` DROP FOREIGN KEY `FK_57de40bc620f456c7311aa3a1e6`");
        await queryRunner.query("ALTER TABLE `users` DROP FOREIGN KEY `FK_5e1a29e5ed3f2c167f87f2993ac`");
        await queryRunner.query("ALTER TABLE `clientAccounts` DROP FOREIGN KEY `FK_d6fcf3ad6446497943b6bd68eb5`");
        await queryRunner.query("ALTER TABLE `bitcoinWallets` DROP FOREIGN KEY `FK_e0a68881fecf384f328da966e48`");
        await queryRunner.query("ALTER TABLE `clientTransactions` DROP FOREIGN KEY `FK_e39c04f3c54d14c4e13ced81244`");
        await queryRunner.query("ALTER TABLE `clientTransactions` DROP FOREIGN KEY `FK_d18708031216bc67db82b47a0f2`");
        await queryRunner.query("ALTER TABLE `clientTransactions` DROP FOREIGN KEY `FK_f079f8c5ae4cb05297501505292`");
        await queryRunner.query("ALTER TABLE `leads` DROP FOREIGN KEY `FK_c128c8da4010cd2cd0b4ae1c56f`");
        await queryRunner.query("DROP TABLE `sessions`");
        await queryRunner.query("DROP INDEX `IDX_97672ac88f789774dd47f7c8be` ON `users`");
        await queryRunner.query("DROP TABLE `users`");
        await queryRunner.query("DROP TABLE `paymentTypes`");
        await queryRunner.query("DROP INDEX `IDX_7397752718d1c9eb873722ec9b` ON `languages`");
        await queryRunner.query("DROP TABLE `languages`");
        await queryRunner.query("DROP INDEX `REL_d6fcf3ad6446497943b6bd68eb` ON `clientAccounts`");
        await queryRunner.query("DROP TABLE `clientAccounts`");
        await queryRunner.query("DROP INDEX `REL_e0a68881fecf384f328da966e4` ON `bitcoinWallets`");
        await queryRunner.query("DROP TABLE `bitcoinWallets`");
        await queryRunner.query("DROP INDEX `IDX_6b39bc13ab676e74eada2e744d` ON `partners`");
        await queryRunner.query("DROP TABLE `partners`");
        await queryRunner.query("DROP INDEX `REL_e39c04f3c54d14c4e13ced8124` ON `clientTransactions`");
        await queryRunner.query("DROP INDEX `REL_d18708031216bc67db82b47a0f` ON `clientTransactions`");
        await queryRunner.query("DROP INDEX `REL_f079f8c5ae4cb0529750150529` ON `clientTransactions`");
        await queryRunner.query("DROP TABLE `clientTransactions`");
        await queryRunner.query("DROP TABLE `transactionCards`");
        await queryRunner.query("DROP TABLE `transactionBitcoins`");
        await queryRunner.query("DROP INDEX `REL_c128c8da4010cd2cd0b4ae1c56` ON `leads`");
        await queryRunner.query("DROP TABLE `leads`");
        await queryRunner.query("DROP INDEX `IDX_c67fe307651535669ac5d5a678` ON `accountTypes`");
        await queryRunner.query("DROP TABLE `accountTypes`");
    }

}
