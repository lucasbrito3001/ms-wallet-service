import { DependencyRegistry } from "@/infra/DependencyRegistry";
import { WalletRepository } from "../repository/WalletRepository";
import { OrderItemsApprovedMessage } from "@/infra/queue/subscriber/OrderItemsApproved";
import { OperationRepository } from "../repository/OperationRepository";
import {
	InsufficientBalanceError,
	NegativeOperationValueError,
	WalletNotFoundError,
} from "@/error/WalletError";
import { Operation } from "@/domain/entities/Operation";
import { UnexpectedError } from "@/error/ErrorBase";

export interface PayOrderPort {
	execute(
		message: OrderItemsApprovedMessage
	): Promise<WalletNotFoundError | void>;
}

export class PayOrder implements PayOrderPort {
	private readonly walletRepository: WalletRepository;
	private readonly operationRepository: OperationRepository;

	constructor(registry: DependencyRegistry) {
		this.walletRepository = registry.inject("walletRepository");
		this.operationRepository = registry.inject("operationRepository");
	}

	async execute(
		message: OrderItemsApprovedMessage
	): Promise<
		| WalletNotFoundError
		| InsufficientBalanceError
		| NegativeOperationValueError
		| void
	> {
		try {
			const wallet = await this.walletRepository.getByAccountId(message.accountId);

			if (wallet === null) return new WalletNotFoundError();

			const operation = Operation.createOrderPayment(message.amount, wallet.id);

			const resultUndefinedOrError = wallet.addOrderPaymentOperation(operation);

			if (resultUndefinedOrError !== undefined) return resultUndefinedOrError;

			return;
		} catch (error) {
			console.log(error);
			return new UnexpectedError();
		}
	}
}
