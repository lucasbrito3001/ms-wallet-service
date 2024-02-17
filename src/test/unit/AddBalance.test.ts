import { beforeEach, describe, expect, test } from "vitest";
import { MockInputOperation, MockInputWallet } from "../constants";
import { AddBalance, AddBalanceOutput } from "@/application/usecase/AddBalance";
import { DependencyRegistry } from "@/infra/DependencyRegistry";
import { Wallet } from "@/domain/entities/Wallet";
import {
	OperationRepositoryInMemory,
	WalletRepositoryInMemory,
} from "@/infra/repository";
import { WalletNotFoundError } from "@/error/WalletError";

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

	test("should return WalletNotFound error, when the wallet don't exists", () => {
		const input = new MockInputOperation(100, "bad-wallet-id");

		const fn = () => useCase.execute(input);

		expect(fn).rejects.toThrow(WalletNotFoundError);
	});

	test("should add balance to wallet successfully", async () => {
		const wallet = Wallet.create(new MockInputWallet(10));
		await walletRepository.save(wallet);
		const input = new MockInputOperation(100, wallet.id);

		const response = await useCase.execute(input);

		expect(response).toBeInstanceOf(AddBalanceOutput);
		expect(response.balance).toBeDefined();
		expect(response.balance).toBe(110);
		expect(response.operationId).toBeDefined();
	});
});
