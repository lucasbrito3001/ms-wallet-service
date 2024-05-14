CREATE DATABASE IF NOT EXISTS `ms_wallet_service`;

DROP TABLE IF EXISTS `ms_wallet_service`.`operation`;
DROP TABLE IF EXISTS `ms_wallet_service`.`wallet`;
DROP TABLE IF EXISTS `ms_wallet_service`.`account`;

CREATE TABLE `ms_wallet_service`.`account` (
    `id` VARCHAR(36) PRIMARY KEY,
    `email` VARCHAR(100) NOT NULL
);

CREATE TABLE `ms_wallet_service`.`wallet` (
    `id` VARCHAR(36) PRIMARY KEY,
    `balance` NUMERIC(10,2) NOT NULL,
    `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `accountId` VARCHAR(36) NOT NULL,
    FOREIGN KEY (`accountId`) REFERENCES `ms_wallet_service`.`account` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE `ms_wallet_service`.`operation` (
    `id` VARCHAR(36) PRIMARY KEY,
    `amount` NUMERIC(8,2) NOT NULL,
    `operationType` ENUM('BALANCE_ADDITION', 'ORDER_PAYMENT') NOT NULL,
    `operationOperator` ENUM('INCREMENT', 'DECREMENT') NOT NULL,
    `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `walletId` VARCHAR(36) NOT NULL,
    FOREIGN KEY (`walletId`) REFERENCES `ms_wallet_service`.`wallet` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
);

INSERT INTO `ms_wallet_service`.`account` (
        `id`,
        `email`
    )
VALUES (
        '3a5e8426-8265-418b-9ade-a82d0f69ec42',
        'johndoe@email.com'
    );

INSERT INTO `ms_wallet_service`.`wallet` (`id`, `balance`, `accountId`)
VALUES (
        'e81a991a-66be-4dee-ad79-acaf0d7b6da1',
        1000.00,
        '3a5e8426-8265-418b-9ade-a82d0f69ec42'
    );

INSERT INTO `ms_wallet_service`.`operation` (`id`, `amount`, `operationType`, `operationOperator`, `walletId`)
VALUES (
        'fcad1c03-3fa5-4265-b89d-7716975ab0c1',
        100.00,
        'ORDER_PAYMENT',
        'DECREMENT',
        'e81a991a-66be-4dee-ad79-acaf0d7b6da1'
    );