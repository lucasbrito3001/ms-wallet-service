import { Wallet } from "@/domain/entities/Wallet";
import { describe, expect, test } from "vitest";
import { MockInputOperation } from "../constants";
import {
	Operation,
	OperationOperator,
	OperationType,
} from "@/domain/entities/Operation";

describe("[Domain - Operation]", () => {
	test("should create a new balance addition operation", () => {
		const input = new MockInputOperation();
		const operation = Operation.createBalanceAddition(input);

		expect(operation.id).toBeDefined();
		expect(operation.createdAt).toBeDefined();
		expect(operation.operationOperator).toBe(OperationOperator.Increment);
		expect(operation.operationType).toBe(OperationType.BalanceAddition);
		expect(operation).toBeInstanceOf(Operation);
	});

	test("should create a new order payment operation", () => {
		const input = new MockInputOperation();
		const operation = Operation.createOrderPayment(input);

		expect(operation.id).toBeDefined();
		expect(operation.createdAt).toBeDefined();
		expect(operation.operationOperator).toBe(OperationOperator.Decrement);
		expect(operation.operationType).toBe(OperationType.OrderPayment);
		expect(operation).toBeInstanceOf(Operation);
	});
});
