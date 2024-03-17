import {
	InsufficientBalanceError,
	InvalidDateCauses,
	InvalidDateRangeError,
	NegativeOperationValueError,
} from "@/error/WalletError";
import { BaseDomain } from "../Base";
import { Operation } from "./Operation";
import { Account } from "./Account";

export class ValidateDateRangeOutputSuccess {
	private _status = true;
	private _dates: { startDate: Date; endDate: Date };

	public get status() {
		return this._status;
	}
	public get dates() {
		return this._dates;
	}

	constructor(startDate: Date, endDate: Date) {
		this._dates = { startDate, endDate };
	}
}

export class ValidateDateRangeOutputError {
	private _status = false;
	private _error: InvalidDateRangeError;

	public get status() {
		return this._status;
	}
	public get error() {
		return this._error;
	}

	constructor(error: InvalidDateRangeError) {
		this._error = error;
	}
}

export type ValidateDateRangeOutput =
	| ValidateDateRangeOutputSuccess
	| ValidateDateRangeOutputError;

export class Wallet extends BaseDomain {
	private constructor(
		private _id: string,
		private _balance: number,
		private _createdAt: string,
		private _account: Account,
		private _operations: Operation[] = []
	) {
		super();
	}

	public get id() {
		return this._id;
	}
	public get balance() {
		return this._balance;
	}
	public get createdAt() {
		return this._createdAt;
	}
	public get account() {
		return this._account;
	}
	public get operations() {
		return this._operations;
	}

	static create = (balance: number, account: Account): Wallet => {
		const uuid = this.generateUUID();
		const createdAt = new Date().toISOString();

		return new Wallet(uuid, balance, createdAt, account);
	};

	static instance = (
		id: string,
		balance: number,
		createdAt: string,
		account: Account
	): Wallet => {
		return new Wallet(id, balance, createdAt, account);
	};

	public addBalanceAdditionOperation = (
		operation: Operation
	): void | NegativeOperationValueError => {
		if (operation.amount <= 0) return new NegativeOperationValueError();

		this._operations.push(operation);
		this._balance += operation.amount;
	};

	public addOrderPaymentOperation = (
		operation: Operation
	): void | NegativeOperationValueError | InsufficientBalanceError => {
		if (operation.amount <= 0) return new NegativeOperationValueError();
		if (this._balance < operation.amount) return new InsufficientBalanceError();

		this._operations.push(operation);
		this._balance -= operation.amount;
	};

	public validateDateRangeToFindTransactions = (
		startDate: Date,
		endDate: Date
	): ValidateDateRangeOutput => {
		if (endDate < startDate) {
			const error = new InvalidDateRangeError(
				InvalidDateCauses.endDateBeforeStartDate
			);

			return new ValidateDateRangeOutputError(error);
		}

		const ninetyDaysInMiliseconds = 7776000000;

		const diffDatesInMiliseconds = endDate.getTime() - startDate.getTime();

		if (diffDatesInMiliseconds > ninetyDaysInMiliseconds) {
			const error = new InvalidDateRangeError(
				InvalidDateCauses.diffGreatherThan90Days
			);

			return new ValidateDateRangeOutputError(error);
		}

		startDate.setUTCHours(0, 0, 0);
		endDate.setUTCHours(23, 59, 59);

		return new ValidateDateRangeOutputSuccess(startDate, endDate);
	};
}
