import { BaseDomain } from "../Base";

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
		private _id: string,
		private _amount: number,
		private _walletId: string,
		private _createdAt: string,
		private _operationType: OperationType,
		private _operationOperator: OperationOperator
	) {
		super();
	}

	public get id() {
		return this._id;
	}
	public get amount() {
		return this._amount;
	}
	public get walletId() {
		return this._walletId;
	}
	public get createdAt() {
		return this._createdAt;
	}
	public get operationType() {
		return this._operationType;
	}
	public get operationOperator() {
		return this._operationOperator;
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

	static createBalanceAddition = (amount: number, walletId: string): Operation => {
		const uuid = this.generateUUID();
		const createdAt = new Date().toISOString();

		return new Operation(
			uuid,
			amount,
			walletId,
			createdAt,
			OperationType.BalanceAddition,
			OperationOperator.Increment
		);
	};

	static createOrderPayment = (amount: number, walletId: string): Operation => {
		const uuid = this.generateUUID();
		const createdAt = new Date().toISOString();

		return new Operation(
			uuid,
			amount,
			walletId,
			createdAt,
			OperationType.OrderPayment,
			OperationOperator.Decrement
		);
	};
}
