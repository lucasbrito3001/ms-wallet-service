import {
	Operation,
	OperationOperator,
	OperationType,
} from "@/domain/entities/Operation";
import { In, Repository } from "typeorm";
import { OperationEntity } from "../entity/Operation.entity";
import { OperationRepository } from "@/application/repository/OperationRepository";

export class OperationRepositoryDatabase implements OperationRepository {
	constructor(private readonly repository: Repository<OperationEntity>) {}

	async save(operation: Operation): Promise<void> {
		await this.repository.save(operation);
	}

	async get(id: string, relations: string[]): Promise<Operation | null> {
		const entity = await this.repository.findOne({
			where: { id },
			relations,
		});

		if (!entity) return null;

		return this.instanceDomain(entity);
	}

	async listByIds(ids: string[]): Promise<Operation[] | null> {
		const entities = await this.repository.find({
			where: { id: In(ids) },
		});

		if (entities.length === 0) return null;

		return entities.map((entity) => this.instanceDomain(entity));
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
