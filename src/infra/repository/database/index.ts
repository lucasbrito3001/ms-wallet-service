// import { In, ObjectLiteral, Repository } from "typeorm";
// import { IRepository } from "..";

// export type BaseType = {
// 	id: string;
// };

// export abstract class RepositoryDatabase<Domain>
// 	implements IRepository<Domain>
// {
// 	protected readonly repository: Repository<ObjectLiteral>;

// 	constructor(repository: Repository<ObjectLiteral>) {
// 		this.repository = repository;
// 	}

// 	async save(entity: Domain): Promise<void> {
// 		await this.repository.save(entity);
// 	}

// 	abstract get(id: string, relations: string[]): Promise<Domain | null>;
// 	abstract listByIds(ids: string[]): Promise<Domain[] | null>;
// 	abstract instanceDomain(entity: ObjectLiteral): Domain;
// }
