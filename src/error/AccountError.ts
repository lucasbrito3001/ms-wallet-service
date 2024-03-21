import { ErrorBase } from "./ErrorBase";

export class DuplicatedAccountError extends ErrorBase {
	constructor() {
		super("DUPLICATED_ACCOUNT", "This account is already registered and already has a wallet", 400);
	}
}