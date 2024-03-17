import { OrderItemsApprovedMessage } from "@/infra/queue/subscriber/OrderItemsApproved";

export const today = new Date();
export const yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
export const hundredDaysAgo = new Date(
	new Date().setDate(new Date().getDate() - 100)
);

export const fakeId = "554e7d53-71f7-44a3-ac9f-5dd467564603";
export const fakeEmail = "fake@example.com";

export class MockInputWallet {
	constructor(public balance: number = 10) {}
}

export class MockAccount {
	constructor(
		public id: string = fakeId,
		public email: string = fakeEmail,
		public firstName: string = "John",
		public lastName: string = "Doe"
	) {}
}

export class MockInputOperation {
	constructor(public amount: number = 10, public walletId: string = fakeId) {}
}

export class MockOrderItemsApproved implements OrderItemsApprovedMessage {
	constructor(
		public amount: number = 100,
		public accountId: string = fakeId,
		public orderId: string = fakeId,
	) {}
}
