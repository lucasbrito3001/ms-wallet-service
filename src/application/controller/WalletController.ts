import { DependencyRegistry } from "@/infra/DependencyRegistry";
import { NextFunction, Request, Response } from "express";

export class WalletController {
	constructor(registry: DependencyRegistry) {}

	checkBalance = async (
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> => {
		try {
			
		} catch (error) {
			next(error);
		}
	};
}
