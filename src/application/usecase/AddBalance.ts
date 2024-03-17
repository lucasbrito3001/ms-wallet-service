import { DependencyRegistry } from "@/infra/DependencyRegistry";
import { OperationInput } from "../schema/input/OperationInput";
import { WalletRepository } from "../repository/WalletRepository";
import { OperationRepository } from "../repository/OperationRepository";
import { Operation } from "@/domain/entities/Operation";
import { Wallet } from "@/domain/entities/Wallet";
import {
	NegativeOperationValueError,
	WalletNotFoundError,
} from "@/error/WalletError";
import { UnexpectedError } from "@/error/ErrorBase";

export class AddBalanceOutput {
	constructor(public balance: number, public operationId: string) {}
}

export interface AddBalancePort {
	execute(
		input: OperationInput
	): Promise<
		AddBalanceOutput | NegativeOperationValueError | WalletNotFoundError
	>;
}

export class AddBalance implements AddBalancePort {
	private readonly walletRepository: WalletRepository;

	constructor(registry: DependencyRegistry) {
		this.walletRepository = registry.inject("walletRepository");
	}

	async execute(
		input: OperationInput
	): Promise<
		AddBalanceOutput | NegativeOperationValueError | WalletNotFoundError
	> {
		try {
			const wallet = await this.walletRepository.get(input.walletId, [
				"operations",
			]);

			if (!wallet) return new WalletNotFoundError();

			const operation = Operation.createBalanceAddition(
				input.amount,
				input.walletId
			);
			const resultAddBalance = wallet.addBalanceAdditionOperation(operation);

			if (resultAddBalance instanceof NegativeOperationValueError)
				return resultAddBalance;

			await this.walletRepository.save(wallet);

			return new AddBalanceOutput(wallet.balance, operation.id);
		} catch (error) {
			console.log(error);
			return new UnexpectedError();
		}
	}
}
