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
