import { In, ObjectLiteral, Repository } from "typeorm";
import { IRepository } from "..";

export type BaseType = {
	id: string;
};

export abstract class RepositoryDatabase<Domain extends ObjectLiteral>
	implements IRepository<Domain>
{
	private readonly repository: Repository<ObjectLiteral>;

	constructor(repository: Repository<ObjectLiteral>) {
		this.repository = repository;
	}

	async get(id: string, relations: string[] = []): Promise<Domain | null> {
		const entity = await this.repository.findOne({
			where: { id },
			relations,
		});

		if (!entity) return null;

		return this.instanceDomain(entity);
	}

	async save(entity: Domain): Promise<void> {
		await this.repository.save(entity);
	}

	async listByIds(ids: string[]): Promise<Domain[] | null> {
		const entities = await this.repository.findBy({ id: In(ids) });

		return entities.map((entity) => this.instanceDomain(entity));
	}

	abstract instanceDomain(entity: ObjectLiteral): Domain;
}
