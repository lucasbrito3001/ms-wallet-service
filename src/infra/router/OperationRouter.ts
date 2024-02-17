import { Router } from "express";
import { AppRouter } from ".";
import { OperationController } from "@/application/controller/OperationController";

export class OperationRouter extends AppRouter {
	constructor(router: Router, private controller: OperationController) {
		super(router);
	}

	expose(): void {
		this.router.put("/add_balance/:walletId", this.controller.addBalance);
	}
}
