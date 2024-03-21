import { PayOrderPort } from "@/application/usecase/PayOrder";
import { QueueSubscriber } from "./QueueSubscriber";
import { Logger } from "@/infra/log/Logger";
import { DependencyRegistry } from "@/infra/DependencyRegistry";
import { CreateWallet, CreateWalletPort } from "@/application/usecase/CreateWallet";

export type AccountCreatedMessage = {
    accountId: string;
	email: string;
	cpf: string;
};

export class AccountCreatedSub implements QueueSubscriber {
	public readonly queueName = "accountCreated";
	private readonly useCase: CreateWalletPort;
	private logger: Logger;

	constructor(readonly registry: DependencyRegistry) {
		this.useCase = registry.inject("createWallet");
		this.logger = registry.inject("logger");
	}

	private logMessage = (orderId: string): void => {
		this.logger.logEvent(
			"AccountCreated",
			`Order items approved, starting to pay the order: ${orderId}`
		);
	};

	public callbackFunction = async (message: AccountCreatedMessage) => {
		try {
			this.logMessage(message.accountId);
			await this.useCase.execute(message);
		} catch (error) {
			const errorAny = error as any;
			throw new Error(errorAny.message);
		}
	};
}
