import { AccountInput } from "@/application/schema/input/AccountInput";
import { BaseDomain } from "../Base";

export class Account extends BaseDomain {
	private constructor(
		private _id: string,
		private _email: string,
		private _firstName: string,
		private _lastName: string
	) {
		super();
	}

	public get id() {
		return this._id;
	}
	public get email() {
		return this._email;
	}
	public get firstName() {
		return this._firstName;
	}
	public get lastName() {
		return this._lastName;
	}

	static create(accountInput: AccountInput) {
		const uuid = this.generateUUID();

		return new Account(
			uuid,
			accountInput.email,
			accountInput.firstName,
			accountInput.lastName
		);
	}

	static instance(accountInput: AccountInput) {
		return new Account(
			accountInput.id,
			accountInput.email,
			accountInput.firstName,
			accountInput.lastName
		);
	}

	public changeEmail(newEmail: string) {
		this._email = newEmail;
	}
}
