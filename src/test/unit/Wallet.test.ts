import { Wallet } from "@/domain/entities/Wallet";
import { describe, expect, test } from "vitest";
import { MockInputOperation, MockInputWallet } from "../constants";
import { Operation } from "@/domain/entities/Operation";
import { InsufficientBalanceError } from "@/error/WalletError";

describe("[Domain - Wallet]", () => {
	test("should create a new wallet", () => {
		const input = new MockInputWallet();
		const wallet = Wallet.create(input);

		expect(wallet.id).toBeDefined();
		expect(wallet.createdAt).toBeDefined();
		expect(wallet.balance).toBeDefined();
		expect(wallet.operations).toBeDefined();
		expect(wallet).toBeInstanceOf(Wallet);
	});

	test("should increase wallet balance", () => {
		const initialBalance = 10;
		const increasedBalance = 100;

		const inputWallet = new MockInputWallet(initialBalance);
		const operationInput = new MockInputOperation(increasedBalance);

		const operation = Operation.createBalanceAddition(operationInput);
		const wallet = Wallet.create(inputWallet);

		const increasedWallet = Wallet.addBalanceAdditionOperation(
			wallet,
			operation
		);

		expect(increasedWallet).toBeDefined();
		expect(increasedWallet?.balance).toBe(initialBalance + increasedBalance);
	});

	test("should return error when decreasing an amount greater than the available balance", () => {
		const initialBalance = 10;
		const decreasedBalance = 100;

		const inputWallet = new MockInputWallet(initialBalance);
		const operationInput = new MockInputOperation(decreasedBalance);

		const operation = Operation.createOrderPayment(operationInput);
		const wallet = Wallet.create(inputWallet);

		const output = Wallet.addOrderPaymentOperation(wallet, operation);

		expect(output).toBeInstanceOf(InsufficientBalanceError);
	});

	test("should decrease wallet balance", () => {
		const initialBalance = 100;
		const decreasedBalance = 10;

		const inputWallet = new MockInputWallet(initialBalance);
		const operationInput = new MockInputOperation(decreasedBalance);

		const operation = Operation.createOrderPayment(operationInput);
		const wallet = Wallet.create(inputWallet);

		const output = Wallet.addOrderPaymentOperation(wallet, operation);

		expect(output).toBeInstanceOf(Wallet);
	});
});
