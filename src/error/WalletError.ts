import { ErrorBase } from "./ErrorBase";

export class WalletNotFoundError extends ErrorBase {
	constructor() {
		super("WALLET_NOT_FOUND", "The wallet was not found in the database", 400);
	}
}

export class InsufficientBalanceError extends ErrorBase {
	constructor() {
		super(
			"INSUFFICIENT_BALANCE",
			"The wallet don't have enough balance to complete the operation",
			400
		);
	}
}

export class NegativeOperationValueError extends ErrorBase {
	constructor() {
		super(
			"NEGATIVE_OPERATION_VALUE",
			"The operation value can't be negative",
			400
		);
	}
}

export enum InvalidDateCauses {
	endDateBeforeStartDate = "endDateBeforeStartDate",
	diffGreatherThan90Days = "diffGreatherThan90Days",
}

export const messagesByCause: Record<InvalidDateCauses, string> = {
	endDateBeforeStartDate: "The start date must be before the end date",
	diffGreatherThan90Days:
		"The difference between the end and the start date must be less than 90 days",
};

export class InvalidDateRangeError extends ErrorBase {
	constructor(cause: InvalidDateCauses) {
		super("INVALID_DATE_RANGE", messagesByCause[cause], 400);
	}
}
