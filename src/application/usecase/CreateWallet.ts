import { AccountCreatedMessage } from "@/domain/event/AccountCreated";
import { DuplicatedAccountError } from "@/error/AccountError";
import { DependencyRegistry } from "@/infra/DependencyRegistry";
import { WalletRepository } from "../repository/WalletRepository";
import { AccountRepository } from "../repository/AccountRepository";
import { UnexpectedError } from "@/error/ErrorBase";
import { Account } from "@/domain/entities/Account";
import { Wallet } from "@/domain/entities/Wallet";

export interface CreateWalletPort {
	execute(
		message: AccountCreatedMessage
	): Promise<DuplicatedAccountError | void>;
}

export class CreateWallet implements CreateWalletPort {
	private readonly walletRepository: WalletRepository;

	constructor(registry: DependencyRegistry) {
		this.walletRepository = registry.inject("walletRepository");
	}

	async execute(
		message: AccountCreatedMessage
	): Promise<void | DuplicatedAccountError | UnexpectedError> {
		try {
			const existentWallet = await this.walletRepository.getByAccountId(
				message.accountId
			);

			if (existentWallet) return new DuplicatedAccountError();

			const account = Account.instance(message);
			const wallet = Wallet.create(0, account);

			await this.walletRepository.save(wallet);

			return;
		} catch (error) {
			console.log(error);
			return new UnexpectedError();
		}
	}
}
