import { InsufficientBalanceError } from "@/error/WalletError";
import { BaseDomain } from "../Base";
import { Operation, OperationOperator } from "./Operation";

export class Wallet extends BaseDomain {
	private constructor(
		public id: string,
		public balance: number,
		public createdAt: string,
		public operations: Operation[]
	) {
		super();
	}

	static create = (inputWallet: any): Wallet => {
		const uuid = this.generateUUID();
		const createdAt = new Date().toISOString();

		return new Wallet(uuid, inputWallet.balance, createdAt, []);
	};

	static instance = (
		id: string,
		balance: number,
		createdAt: string,
		operations: Operation[]
	): Wallet => {
		return new Wallet(id, balance, createdAt, operations);
	};

	private static increaseBalance = (wallet: Wallet, value: number): Wallet => {
		wallet.balance += value;

		const increasedWallet = new Wallet(
			wallet.id,
			wallet.balance,
			wallet.createdAt,
			wallet.operations
		);

		return increasedWallet;
	};

	private static decreaseBalance = (
		wallet: Wallet,
		value: number
	): Wallet | InsufficientBalanceError => {
		if (wallet.balance < value) return new InsufficientBalanceError();

		wallet.balance -= value;

		const decreasedWallet = new Wallet(
			wallet.id,
			wallet.balance,
			wallet.createdAt,
			wallet.operations
		);

		return decreasedWallet;
	};

	static addBalanceAdditionOperation = (
		wallet: Wallet,
		operation: Operation
	) => {
		const increasedWallet = this.increaseBalance(wallet, operation.amount);

		increasedWallet.operations.push(operation);

		return increasedWallet;
	};

	static addOrderPaymentOperation = (wallet: Wallet, operation: Operation) => {
		const output = this.decreaseBalance(wallet, operation.amount);

		if (output instanceof Wallet) output.operations.push(operation);

		return output;
	};
}
