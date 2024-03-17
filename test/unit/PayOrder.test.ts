import { PayOrder, PayOrderPort } from "@/application/usecase/PayOrder";
import { Account } from "@/domain/entities/Account";
import { Wallet } from "@/domain/entities/Wallet";
import { InvalidInputError } from "@/error/InfraError";
import {
	InsufficientBalanceError,
	NegativeOperationValueError,
	WalletNotFoundError,
} from "@/error/WalletError";
import { DependencyRegistry } from "@/infra/DependencyRegistry";
import {
	OperationRepositoryInMemory,
	WalletRepositoryInMemory,
} from "@/infra/repository";
import { MockAccount, MockOrderItemsApproved } from "test/constants";
import { beforeEach, describe, expect, it, test } from "vitest";

describe("[UseCase - PayOrder]", () => {
	const account = Account.create(new MockAccount());
	const wallet = Wallet.create(100, account);

	let useCase: PayOrderPort;
	let registry: DependencyRegistry;
	let walletRepository: WalletRepositoryInMemory;
	let operationRepository: OperationRepositoryInMemory;

	beforeEach(async () => {
		registry = new DependencyRegistry();

		walletRepository = new WalletRepositoryInMemory();
		operationRepository = new OperationRepositoryInMemory();

		registry
			.push("walletRepository", walletRepository)
			.push("operationRepository", operationRepository);

		useCase = new PayOrder(registry);

		await walletRepository.save(wallet);
	});

	test("should return WalletNotFoundError when the wallet doesn't exists", async () => {
		const input = new MockOrderItemsApproved();

		const result = await useCase.execute(input);

		expect(result).toBeInstanceOf(WalletNotFoundError);
	});

	test("should return InsufficientBalanceError when trying to pay for an order with greater value than the wallet balance", async () => {
		const input = new MockOrderItemsApproved(500, account.id);

		const result = await useCase.execute(input);

		expect(result).toBeInstanceOf(InsufficientBalanceError);
	});

	test("should return NegativeOperationValueError when trying to pay for an order with negative amount", async () => {
		const input = new MockOrderItemsApproved(-100, account.id);

		const result = await useCase.execute(input);

		expect(result).toBeInstanceOf(NegativeOperationValueError);
	});
});
