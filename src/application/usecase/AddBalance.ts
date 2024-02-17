import { DependencyRegistry } from "@/infra/DependencyRegistry";
import { OperationInput } from "../schema/input/OperationInput";
import { WalletRepository } from "../repository/WalletRepository";
import { OperationRepository } from "../repository/OperationRepository";
import { Operation } from "@/domain/entities/Operation";
import { Wallet } from "@/domain/entities/Wallet";
import { WalletNotFoundError } from "@/error/WalletError";

export class AddBalanceOutput {
	constructor(public balance: number, public operationId: string) {}
}

export interface AddBalancePort {
	execute(input: OperationInput): Promise<AddBalanceOutput>;
}

export class AddBalance implements AddBalancePort {
	private readonly operationRepository: OperationRepository;
	private readonly walletRepository: WalletRepository;

	constructor(registry: DependencyRegistry) {
		this.operationRepository = registry.inject("operationRepository");
		this.walletRepository = registry.inject("walletRepository");
	}

	async execute(input: OperationInput): Promise<AddBalanceOutput> {
		const wallet = await this.walletRepository.get(input.walletId, [
			"operations",
		]);

		if (!wallet) throw new WalletNotFoundError();

		const operation = Operation.createBalanceAddition(input);
		const increasedWallet = Wallet.addBalanceAdditionOperation(
			wallet,
			operation
		);

		await this.operationRepository.save(operation);
		await this.walletRepository.save(increasedWallet);

		return new AddBalanceOutput(increasedWallet.balance, operation.id);
	}
}
