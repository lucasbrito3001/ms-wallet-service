import { AccountInput } from "@/application/schema/input/AccountInput";
import { BaseDomain } from "../Base";

export class Account extends BaseDomain {
	private constructor(
		private _id: string,
		private _email: string,
		private _cpf: string
	) {
		super();
	}

	public get id() {
		return this._id;
	}
	public get email() {
		return this._email;
	}
	public get cpf() {
		return this._cpf;
	}

	static create(accountInput: AccountInput) {
		const uuid = this.generateUUID();

		return new Account(uuid, accountInput.email, accountInput.cpf);
	}

	static instance(accountInput: AccountInput) {
		return new Account(
			accountInput.accountId,
			accountInput.email,
			accountInput.cpf
		);
	}

	public changeEmail(newEmail: string) {
		this._email = newEmail;
	}
}
