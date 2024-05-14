import { AccountInput } from "@/application/schema/input/AccountInput";
import { BaseDomain } from "../Base";

export class Account extends BaseDomain {
	private constructor(
		private _id: string,
		private _email: string
	) {
		super();
	}

	public get id() {
		return this._id;
	}
	public get email() {
		return this._email;
	}

	static create(accountInput: AccountInput) {
		const uuid = this.generateUUID();

		return new Account(uuid, accountInput.email);
	}

	static instance(accountInput: AccountInput) {
		return new Account(
			accountInput.accountId,
			accountInput.email
		);
	}

	public changeEmail(newEmail: string) {
		this._email = newEmail;
	}
}
