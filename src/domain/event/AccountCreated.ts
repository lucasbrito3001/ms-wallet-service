import { Event } from "../Base";

export type AccountCreatedMessage = {
	accountId: string;
	email: string;
};

export class AccountCreated implements Event {
	readonly queueName: string = "account-created";

	private constructor(public readonly message: AccountCreatedMessage) {}

	static create(message: AccountCreatedMessage): AccountCreated {
		const event = new AccountCreated(message);

		return event;
	}
}
