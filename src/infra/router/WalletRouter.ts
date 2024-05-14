import { Router } from "express";
import { AppRouter } from ".";
import { WalletController } from "@/application/controller/WalletController";

export class WalletRouter extends AppRouter {
	constructor(router: Router, private controller: WalletController) {
		super(router);
	}

	expose(): void {
		this.router.get("/check_balance/:walletId", this.controller.checkBalance);
	}
}
