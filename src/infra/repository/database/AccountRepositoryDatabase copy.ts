import { In, Repository } from "typeorm";
import { OperationEntity } from "../entity/Operation.entity";
import { AccountRepository } from "@/application/repository/AccountRepository";
import { Account } from "@/domain/entities/Account";
import { AccountEntity } from "../entity/Account.entity";

export class AccountRepositoryDatabase implements AccountRepository {
	constructor(private readonly repository: Repository<OperationEntity>) {}

	async save(operation: Account): Promise<void> {
		await this.repository.save(operation);
	}

	async get(id: string, relations: string[]): Promise<Account | null> {
		const entity = await this.repository.findOne({
			where: { id },
			relations,
		});

		if (!entity) return null;

		return this.instanceDomain(entity);
	}

	async listByIds(ids: string[]): Promise<Account[] | null> {
		const entities = await this.repository.find({
			where: { id: In(ids) },
		});

		if (entities.length === 0) return null;

		return entities.map((entity) => this.instanceDomain(entity));
	}

	instanceDomain(entity: AccountEntity): Account {
		return Account.instance({
			accountId: entity.id as string,
			email: entity.email as string,
			cpf: entity.cpf as string,
		});
	}
}
