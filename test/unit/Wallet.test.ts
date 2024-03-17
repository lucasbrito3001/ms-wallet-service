import {
	ValidateDateRangeOutputError,
	ValidateDateRangeOutputSuccess,
	Wallet,
} from "@/domain/entities/Wallet";
import { describe, expect, test } from "vitest";
import {
	MockAccount,
	MockInputOperation,
	MockInputWallet,
	fakeId,
	hundredDaysAgo,
	today,
	yesterday,
} from "../constants";
import { Operation } from "@/domain/entities/Operation";
import {
	InsufficientBalanceError,
	InvalidDateCauses,
	messagesByCause,
} from "@/error/WalletError";
import { Account } from "@/domain/entities/Account";

describe("[Domain - Wallet]", () => {
	test("should create a new wallet", () => {
		const account = Account.create(new MockAccount());
		const wallet = Wallet.create(100, account);

		expect(wallet.id).toBeDefined();
		expect(wallet.createdAt).toBeDefined();
		expect(wallet.balance).toBeDefined();
		expect(wallet.operations).toStrictEqual([]);
		expect(wallet).toBeInstanceOf(Wallet);
	});

	test("should increase wallet balance", () => {
		const initialBalance = 10;
		const increasedBalance = 100;
		
		const operationInput = new MockInputOperation(increasedBalance);

		const operation = Operation.createBalanceAddition(
			operationInput.amount,
			operationInput.walletId
		);
		const account = Account.create(new MockAccount());
		const wallet = Wallet.create(initialBalance, account);

		const increasedWallet = wallet.addBalanceAdditionOperation(operation);

		expect(wallet.operations.length).toBe(1);
		expect(wallet.balance).toBe(initialBalance + increasedBalance);
	});

	test("should return error when decreasing an amount greater than the available balance", () => {
		const initialBalance = 10;
		const decreasedBalance = 100;

		const operationInput = new MockInputOperation(decreasedBalance);

		const operation = Operation.createBalanceAddition(
			operationInput.amount,
			operationInput.walletId
		);
		const account = Account.create(new MockAccount());
		const wallet = Wallet.create(initialBalance, account);

		const output = wallet.addOrderPaymentOperation(operation);

		expect(output).toBeInstanceOf(InsufficientBalanceError);
	});

	test("should decrease wallet balance", () => {
		const initialBalance = 100;
		const decreasedBalance = 10;

		const operationInput = new MockInputOperation(decreasedBalance);

		const operation = Operation.createBalanceAddition(
			operationInput.amount,
			operationInput.walletId
		);
		const account = Account.create(new MockAccount());
		const wallet = Wallet.create(initialBalance, account);

		const output = wallet.addOrderPaymentOperation(operation);

		expect(output).toBeUndefined();
	});

	test("should return error when searching transactions with end date before start date", () => {
		const account = Account.create(new MockAccount());
		const wallet = Wallet.create(100, account);

		const result = wallet.validateDateRangeToFindTransactions(today, yesterday);
		const resultError = result as ValidateDateRangeOutputError;

		expect(result).toBeInstanceOf(ValidateDateRangeOutputError);
		expect(resultError.error.message).toBe(
			messagesByCause[InvalidDateCauses.endDateBeforeStartDate]
		);
	});

	test("should return error when searching transactions with diff dates greather than the limit", () => {
		const account = Account.create(new MockAccount());
		const wallet = Wallet.create(100, account);

		const result = wallet.validateDateRangeToFindTransactions(
			hundredDaysAgo,
			today
		);
		const resultError = result as ValidateDateRangeOutputError;

		expect(result).toBeInstanceOf(ValidateDateRangeOutputError);
		expect(resultError.error.message).toBe(
			messagesByCause[InvalidDateCauses.diffGreatherThan90Days]
		);
	});

	test("should return success in the date range validation", () => {
		const account = Account.create(new MockAccount());
		const wallet = Wallet.create(100, account);

		const result = wallet.validateDateRangeToFindTransactions(yesterday, today);
		const resultSuccess = result as ValidateDateRangeOutputSuccess;

		yesterday.setUTCHours(0, 0, 0);
		today.setUTCHours(23, 59, 59);

		expect(result).toBeInstanceOf(ValidateDateRangeOutputSuccess);
		expect(resultSuccess.dates).toStrictEqual({
			startDate: yesterday,
			endDate: today,
		});
	});
});
