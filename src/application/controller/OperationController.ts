import { DependencyRegistry } from "@/infra/DependencyRegistry";
import { NextFunction, Request, Response } from "express";
import { AddBalancePort } from "../usecase/AddBalance";
import { OperationInput } from "../schema/input/OperationInput";
import { SchemaValidator } from "../schema";
import { InvalidInputError } from "@/error/InfraError";
import { PayOrderPort } from "../usecase/PayOrder";

export class OperationController {
	private readonly _addBalance: AddBalancePort;
	private readonly _payOrder: PayOrderPort;
	private readonly _addOperationSchemaValidator: SchemaValidator;

	constructor(registry: DependencyRegistry) {
		this._addBalance = registry.inject("addBalance");
		this._payOrder = registry.inject("payOrder");
		this._addOperationSchemaValidator = registry.inject(
			"addOperationSchemaValidation"
		);
	}

	addBalance = async (
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> => {
		try {
			const { walletId } = req.params as { walletId: string };
			const { amount } = req.body as { amount: number };

			const input: OperationInput = { walletId, amount };

			const schemaValidation =
				this._addOperationSchemaValidator.validate(input);

			if (!schemaValidation.isValid)
				throw new InvalidInputError(schemaValidation.errors);

			const output = await this._addBalance.execute(input);

			res.status(200).json(output);

			return;
		} catch (error) {
			next(error);
		}
	};

	payOrder = async (
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> => {
		
	};
}
