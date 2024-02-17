import { BaseDomain } from "../Base";
import { Wallet } from "./Wallet";

export enum OperationType {
	BalanceAddition = "BALANCE_ADDITION",
	OrderPayment = "ORDER_PAYMENT",
}

export enum OperationOperator {
	Increment = "INCREMENT",
	Decrement = "DECREMENT",
}

export class Operation extends BaseDomain {
	private constructor(
		public id: string,
		public amount: number,
		public walletId: string,
		public createdAt: string,
		public operationType: OperationType,
		public operationOperator: OperationOperator
	) {
		super();
	}

	static instance = (
		id: string,
		amount: number,
		walletId: string,
		createdAt: string,
		operationType: OperationType,
		operationOperator: OperationOperator
	): Operation => {
		return new Operation(
			id,
			amount,
			walletId,
			createdAt,
			operationType,
			operationOperator
		);
	};

	static createBalanceAddition = (operationInput: any): Operation => {
		const uuid = this.generateUUID();
		const createdAt = new Date().toISOString();

		return new Operation(
			uuid,
			operationInput.amount,
			operationInput.walletId,
			createdAt,
			OperationType.BalanceAddition,
			OperationOperator.Increment
		);
	};

	static createOrderPayment = (operationInput: any): Operation => {
		const uuid = this.generateUUID();
		const createdAt = new Date().toISOString();

		return new Operation(
			uuid,
			operationInput.amount,
			operationInput.walletId,
			createdAt,
			OperationType.OrderPayment,
			OperationOperator.Decrement
		);
	};
}
