import request from "supertest";
import { Express } from "express";
import {
	afterAll,
	afterEach,
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

describe("[e2e - AddBalance]", () => {
	const logger = new GeneralLogger();
	const queue = new RabbitMQAdapter(logger);

	let app: Express;
	let webServer: WebServer;
	let dataSourceConnection: DataSourceConnection;

	const account: Account = Account.create(new MockAccount());
	const wallet: Wallet = Wallet.create(100, account);

	beforeAll(async () => {
		dataSourceConnection = new DataSourceConnection();
		webServer = new WebServer(dataSourceConnection, queue, logger);

		app = (await webServer.start(true)) as Express;
	});

	afterAll(() => {
		dataSourceConnection.close();
	});

	test("should return InvalidInputError when pass invalid input", async () => {
		const input = new MockInputOperation(-100, wallet.id);

		const response = await request(app)
			.put(`/add_balance/bad-wallet-id`)
			.send(input);

		expect(response.status).toBe(400);
		expect(response.body.message).toBeDefined();
		expect(response.body.name).toBe("INVALID_INPUT");
		expect(response.body.cause).toEqual([
			{
				code: "invalid_string",
				message: "Invalid uuid",
				property: "walletId",
			},
			{
				code: "too_small",
				message: "Number must be greater than or equal to 0",
				property: "amount",
			},
		]);
	});

	test("should return WalletNotFoundError when add balance to a non-existing wallet", async () => {
		const input = new MockInputOperation(100, wallet.id);

		const response = await request(app)
			.put(`/add_balance/${wallet.id}`)
			.send(input);

		expect(response.body.name).toBe("WALLET_NOT_FOUND");
		expect(response.body.message).toBeDefined();
		expect(response.status).toBe(400);
	});

	test("should add balance to wallet successfully", async () => {
		const walletRepo = new WalletRepositoryDatabase(
			dataSourceConnection.getRepository(WalletEntity)
		);

		await walletRepo.save(wallet);

		const input = new MockInputOperation(100, wallet.id);

		const response = await request(app)
			.put(`/add_balance/${wallet.id}`)
			.send(input);

		expect(response.body.operationId).toBeDefined();
		expect(response.body.balance).toBe(110);
		expect(response.status).toBe(200);
	});
});
