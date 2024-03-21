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
		this.useCase = registry.inject("payOrder");
		this.logger = registry.inject("logger");
	}

	private logMessage = (orderId: string): void => {
		this.logger.logEvent(
			"OrderItemsApproved",
			`Order items approved, starting to pay the order: ${orderId}`
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
