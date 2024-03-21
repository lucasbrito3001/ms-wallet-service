import { AccountRepository } from "@/application/repository/AccountRepository";
import { WalletRepository } from "@/application/repository/WalletRepository";
import {
	CreateWallet,
	CreateWalletPort,
} from "@/application/usecase/CreateWallet";
import { Account } from "@/domain/entities/Account";
import { Wallet } from "@/domain/entities/Wallet";
import { DuplicatedAccountError } from "@/error/AccountError";
import { DependencyRegistry } from "@/infra/DependencyRegistry";
import {
	AccountRepositoryInMemory,
	WalletRepositoryInMemory,
} from "@/infra/repository";
import { MockAccount, MockAccountCreated } from "test/constants";
import { beforeEach, describe, expect, test, vi } from "vitest";

describe("[UseCase - CreateWallet]", () => {
	let useCase: CreateWalletPort;

	let registry: DependencyRegistry;
	let walletRepository: WalletRepository;
	let accountRepository: AccountRepository;

	beforeEach(async () => {
		registry = new DependencyRegistry();

		walletRepository = new WalletRepositoryInMemory();
		accountRepository = new AccountRepositoryInMemory();

		registry
			.push("walletRepository", walletRepository)
			.push("accountRepository", accountRepository);

		useCase = new CreateWallet(registry);
	});

	test("should return DuplicatedAccountError when the account already exists", async () => {
		const account = Account.create(new MockAccount());
		const wallet = Wallet.create(100, account);

		const input = new MockAccountCreated(account.id);

		await walletRepository.save(wallet);

		const result = await useCase.execute(input);

		expect(result).toBeInstanceOf(DuplicatedAccountError);
	});

	test("should create a new account and wallet successfully", async () => {
		const spySaveWallet = vi.spyOn(walletRepository, "save");

		const input = new MockAccountCreated();

		const result = await useCase.execute(input);

		expect(result).toBeUndefined();
        expect(spySaveWallet).toHaveBeenCalledOnce();
	});
});
