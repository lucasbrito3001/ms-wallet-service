import request from "supertest";
import { Express } from "express";
import {
	afterAll,
	beforeAll,
	beforeEach,
	describe,
	expect,
	test,
} from "vitest";
import { MockAccount, MockInputOperation, MockInputWallet } from "../constants";
import { WebServer } from "@/infra/Server";
import { DataSourceConnection } from "@/infra/data/DataSource";
import { GeneralLogger } from "@/infra/log/GeneralLogger";
import { RabbitMQAdapter } from "@/infra/queue/RabbitMQAdapter";
import { WalletEntity } from "@/infra/repository/entity/Wallet.entity";
import { Wallet } from "@/domain/entities/Wallet";
import { WalletRepositoryDatabase } from "@/infra/repository/database/WalletRepositoryDatabase";
import { Account } from "@/domain/entities/Account";
import { AccountCreated } from "@/domain/event/AccountCreated";
import { WalletRepository } from "@/application/repository/WalletRepository";
import { Repository } from "typeorm";
import { AccountEntity } from "@/infra/repository/entity/Account.entity";
import { AccountCreatedSub } from "@/infra/queue/subscriber/AccountCreated";
import { DependencyRegistry } from "@/infra/DependencyRegistry";
import { CreateWallet } from "@/application/usecase/CreateWallet";
import { AccountRepositoryDatabase } from "@/infra/repository/database/AccountRepositoryDatabase copy";

describe("[e2e - CreateWallet]", () => {
	const logger = new GeneralLogger();
	const queue = new RabbitMQAdapter(logger);
	const dataSourceConnection = new DataSourceConnection();
	const registry = new DependencyRegistry();

	let walletRepo: Repository<WalletEntity>;
	let accountRepo: Repository<AccountEntity>;

	let walletRepository: WalletRepositoryDatabase;
	let accountRepository: AccountRepositoryDatabase;

	const account: Account = Account.create(new MockAccount());
	const wallet: Wallet = Wallet.create(100, account);

	beforeAll(async () => {
		process.env.QUEUE_ACCOUNT_CREATED_RETRIES = "1";

		await dataSourceConnection.initialize();
		await queue.connect();

		walletRepo = dataSourceConnection.getRepository(WalletEntity);
		accountRepo = dataSourceConnection.getRepository(AccountEntity);

		walletRepository = new WalletRepositoryDatabase(walletRepo);
		accountRepository = new AccountRepositoryDatabase(accountRepo);

		registry
			.push("logger", logger)
			.push("walletRepository", walletRepository)
			.push("accountRepository", accountRepository)
			.push("createWallet", new CreateWallet(registry));
	});

	beforeEach(async () => {
		await walletRepo.clear();
		await accountRepo.clear();
	});

	afterAll(() => {
		dataSourceConnection.close();
		queue.connection?.close();
	});

	test("should not create a new wallet when trying to create an account with an ID that already exists", async () => {
		await accountRepository.save(account);
		await walletRepository.save(wallet);

		const subscriber = new AccountCreatedSub(registry);

		const event = AccountCreated.create({
			accountId: account.id,
			email: account.email,
		});

		await queue.publish(event);

		await queue.subscribe(subscriber);

		await new Promise((resolve) => setTimeout(resolve, 1000));

		const wallets = await walletRepo.find();
		const accounts = await accountRepo.find();

		expect(wallets.length).toBe(1);
		expect(accounts.length).toBe(1);
	});

	test("should create a new wallet and account when receive an AccountCreated event", async () => {
		await accountRepository.save(account);
		await walletRepository.save(wallet);

		const subscriber = new AccountCreatedSub(registry);

		const event = AccountCreated.create(new MockAccount());

		await queue.publish(event);

		await queue.subscribe(subscriber);

		await new Promise((resolve) => setTimeout(resolve, 1000));

		const wallets = await walletRepo.find();
		const accounts = await accountRepo.find();

		expect(wallets.length).toBe(2);
		expect(accounts.length).toBe(2);
	});
});
