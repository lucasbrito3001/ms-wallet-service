import { PayOrderPort } from "@/application/usecase/PayOrder";
import { QueueSubscriber } from "./QueueSubscriber";
import { Logger } from "@/infra/log/Logger";
import { DependencyRegistry } from "@/infra/DependencyRegistry";

export type OrderItemsApprovedMessage = {
	orderId: string;
	accountId: string;
	amount: number;
};

export class OrderItemsApprovedSub implements QueueSubscriber {
	public readonly queueName = "orderItemsApproved";
	private readonly useCase: PayOrderPort;
	private logger: Logger;

	constructor(readonly registry: DependencyRegistry) {
		this.useCase = registry.inject("registerItemCopy");
		this.logger = registry.inject("logger");
	}

	private logMessage = (bookId: string): void => {
		this.logger.logEvent(
			"BookStocked",
			`Adding book ${bookId} to the database`
		);
	};

	public callbackFunction = async (message: OrderItemsApprovedMessage) => {
		try {
			this.logMessage(message.orderId);
			await this.useCase.execute(message);
		} catch (error) {
			const errorAny = error as any;
			throw new Error(errorAny.message);
		}
	};
}
