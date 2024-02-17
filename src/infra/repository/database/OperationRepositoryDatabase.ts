import {
	Operation,
	OperationOperator,
	OperationType,
} from "@/domain/entities/Operation";
import { RepositoryDatabase } from ".";
import { Repository } from "typeorm";
import { OperationEntity } from "../entity/Operation.entity";

export class OperationRepositoryDatabase extends RepositoryDatabase<Operation> {
	constructor(repository: Repository<OperationEntity>) {
		super(repository);
	}

	instanceDomain(entity: OperationEntity): Operation {
		return Operation.instance(
			entity.id as string,
			entity.amount as number,
			entity.walletId as string,
			entity.createdAt as string,
			entity.operationType as OperationType,
			entity.operationOperator as OperationOperator
		);
	}
}
