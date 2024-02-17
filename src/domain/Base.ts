import { randomUUID } from "crypto";

export class BaseDomain {
	static generateUUID(): string {
		return randomUUID();
	}
}

export interface Event {
	queueName: string;
	message: any;
}
