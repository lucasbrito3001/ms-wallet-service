export class MockInputWallet {
	constructor(public balance: number = 10) {}
}

export const fakeId = "554e7d53-71f7-44a3-ac9f-5dd467564603";

export class MockInputOperation {
	constructor(
		public amount: number = 10,
		public walletId: string = "ae341fd9-439f-4687-b2a1-c81300955335"
	) {}
}
