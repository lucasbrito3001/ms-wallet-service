import { beforeEach, describe, expect, test } from "vitest";
import {
	MockAccount,
	MockInputOperation,
	MockInputWallet,
	fakeId,
} from "../constants";
import { AddBalance, AddBalanceOutput } from "@/application/usecase/AddBalance";
import { DependencyRegistry } from "@/infra/DependencyRegistry";
import { Wallet } from "@/domain/entities/Wallet";
import {
	OperationRepositoryInMemory,
	WalletRepositoryInMemory,
} from "@/infra/repository";
import { WalletNotFoundError } from "@/error/WalletError";
import { Account } from "@/domain/entities/Account";

describe("[UseCase - AddBalance]", () => {
	let useCase: AddBalance;
	let registry: DependencyRegistry;
	let walletRepository: WalletRepositoryInMemory;
	let operationRepository: OperationRepositoryInMemory;

	beforeEach(() => {
		registry = new DependencyRegistry();

		walletRepository = new WalletRepositoryInMemory();
		operationRepository = new OperationRepositoryInMemory();

		registry
			.push("walletRepository", walletRepository)
			.push("operationRepository", operationRepository);

		useCase = new AddBalance(registry);
	});

	test("should return WalletNotFound error, when the wallet don't exists", async () => {
		const input = new MockInputOperation(100, "bad-wallet-id");

		const result = await useCase.execute(input);

		expect(result).toBeInstanceOf(WalletNotFoundError);
	});

	test("should add balance to wallet successfully", async () => {
		const account = Account.create(new MockAccount());
		const wallet = Wallet.create(10, account);

		await walletRepository.save(wallet);

		const input = new MockInputOperation(100, wallet.id);

		const response = (await useCase.execute(input)) as AddBalanceOutput;

		expect(response).toBeInstanceOf(AddBalanceOutput);
		expect(response.balance).toBeDefined();
		expect(response.balance).toBe(110);
		expect(response.operationId).toBeDefined();
	});
});
